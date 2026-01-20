import { httpResponse, httpResponseError } from "../utils/http/httpResponse.js";
import { generalStatus } from "../utils/http/httpStatus.js";
import containerServices from "../services/containerServices.js";
import containerDto from "../dto/containerDto.js";
import cardDto from "../dto/cardDto.js";

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

const createContainer = async (req, res) => {
  try {
    let containerInput = req.body?.data;

    if (typeof containerInput === "string") {
      try {
        containerInput = JSON.parse(containerInput);
      } catch (parseError) {
        console.log("container.create validation error: invalid JSON data");
        httpResponseError(res, generalStatus.BAD_REQUEST, "data must be JSON");
        return;
      }
    }

    if (!containerInput) {
      console.log("container.create validation error: missing data");
      httpResponseError(res, generalStatus.BAD_REQUEST, "data is required");
      return;
    }

    const { name, description } = containerInput;
    const cards = mergeCardImages(containerInput.cards, req.files);

    if (!name) {
      console.log("container.create validation error: missing name");
      httpResponseError(res, generalStatus.BAD_REQUEST, "name is required");
      return;
    }

    if (!Array.isArray(cards)) {
      console.log(
        "container.create validation error: cards is not array",
        typeof cards,
      );
      httpResponseError(res, generalStatus.BAD_REQUEST, "cards must be array");
      return;
    }

    for (const [index, card] of cards.entries()) {
      if (!card?.front?.text || !card?.back?.text) {
        console.log(
          "container.create validation error: card missing front/back text",
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

    const { container, cards: createdCards } =
      await containerServices.createContainerWithCards(
        { name, description },
        cards,
      );

    httpResponse(res, generalStatus.SUCCESS, {
      container: containerDto.toDTO(container),
      cards: createdCards.map((card) => cardDto.toDTO(card)),
    });
  } catch (error) {
    httpResponseError(res, error);
  }
};

export { createContainer };
