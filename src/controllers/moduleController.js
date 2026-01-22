import { httpResponse, httpResponseError } from "../utils/http/httpResponse.js";
import { generalStatus } from "../utils/http/httpStatus.js";
import moduleServices from "../services/moduleServices.js";
import moduleDto from "../dto/moduleDto.js";

/// берем оттельно фалы и мачим их с карточками ----

const mergeCardImages = (cards = [], files = []) => {
  if (!Array.isArray(cards)) return cards;

  const imagesById = {};
  for (const file of files) {
    const match = /^cards\[([^\]]+)\]\[(front|back)\]\[img\]$/.exec(
      file?.fieldname || "",
    );
    if (!match) continue;

    const [, id, side] = match;
    imagesById[id] = imagesById[id] || {};
    imagesById[id][side] = {
      imageBase64: file.buffer.toString("base64"),
      imageType: file?.mimetype?.split("/")?.[1],
      alt: file.originalname,
    };
  }

  return cards.map((card) => {
    const images = imagesById[card?.id];
    if (!images) return card;

    return {
      ...card,
      ...(images.front
        ? { front: { ...(card?.front || {}), img: images.front } }
        : {}),
      ...(images.back
        ? { back: { ...(card?.back || {}), img: images.back } }
        : {}),
    };
  });
};

///----

const createModule = async (req, res) => {
  try {
    let moduleInput = req.body?.data;

    if (typeof moduleInput === "string") {
      try {
        moduleInput = JSON.parse(moduleInput);
      } catch (parseError) {
        console.log("module.create validation error: invalid JSON data");
        httpResponseError(res, generalStatus.BAD_REQUEST, "data must be JSON");
        return;
      }
    }

    if (!moduleInput) {
      console.log("module.create validation error: missing data");
      httpResponseError(res, generalStatus.BAD_REQUEST, "data is required");
      return;
    }

    const { name, description } = moduleInput;
    const cards = mergeCardImages(moduleInput.cards, req.files);

    if (!name) {
      console.log("module.create validation error: missing name");
      httpResponseError(res, generalStatus.BAD_REQUEST, "name is required");
      return;
    }

    if (!Array.isArray(cards)) {
      console.log(
        "module.create validation error: cards is not array",
        typeof cards,
      );
      httpResponseError(res, generalStatus.BAD_REQUEST, "cards must be array");
      return;
    }

    for (const [index, card] of cards.entries()) {
      if (!card?.front?.text || !card?.back?.text) {
        console.log(
          "module.create validation error: card missing front/back text",
          { index, card },
        );
        httpResponseError(
          res,
          generalStatus.BAD_REQUEST,
          `cards[${index}].front.text and cards[${index}].back.text are required`,
        );
        return;
      }
    }

    const { module: moduleDoc, cards: createdCards } =
      await moduleServices.createModuleWithCards(
        { name, description },
        cards,
      );

    httpResponse(res, generalStatus.SUCCESS, {
      module: moduleDto.toDTO(moduleDoc),
      cards: createdCards.map((card) => cardDto.toDTO(card)),
    });
  } catch (error) {
    httpResponseError(res, error);
  }
};

const getModules = async (req, res) => {
  try {
    const modules = await moduleServices.getModules();
    httpResponse(
      res,
      generalStatus.SUCCESS,
      modules.map((moduleDoc) => moduleDto.toDTO(moduleDoc)),
    );
  } catch (error) {
    httpResponseError(res, error);
  }
};

const getModule = async (req, res) => {
  try {
    const moduleDoc = await moduleServices.getModuleById(req.params.id);
    if (!moduleDoc) {
      httpResponseError(res, generalStatus.NOT_FOUND, "Module not found");
      return;
    }
    httpResponse(res, generalStatus.SUCCESS, moduleDto.toDTO(moduleDoc));
  } catch (error) {
    httpResponseError(res, error);
  }
};

export { createModule, getModules, getModule };
