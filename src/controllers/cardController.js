import { httpResponse, httpResponseError } from "../utils/http/httpResponse.js";
import { generalStatus } from "../utils/http/httpStatus.js";
import cardServices from "../services/cardServices.js";
import cardDto from "../dto/cardDto.js";

const createCard = async (req, res) => {
  try {
    const cardInput = req.body?.data;

    if (!cardInput) {
      httpResponseError(res, generalStatus.BAD_REQUEST, "data is required");
      return;
    }

    if (!cardInput?.front?.text || !cardInput?.back?.text) {
      httpResponseError(
        res,
        generalStatus.BAD_REQUEST,
        "front.text and back.text are required",
      );
      return;
    }

    const cardEntity = cardDto.toEntity(cardInput);

    const card = await cardServices.createCard(cardEntity);
    httpResponse(res, generalStatus.SUCCESS, cardDto.toDTO(card));
  } catch (error) {
    httpResponseError(res, error);
  }
};

const getCard = async (req, res) => {
  try {
    const card = await cardServices.getCardById(req.params.id);
    if (!card) {
      httpResponseError(res, generalStatus.NOT_FOUND, "Card not found");
      return;
    }
    httpResponse(res, generalStatus.SUCCESS, cardDto.toDTO(card));
  } catch (error) {
    httpResponseError(res, error);
  }
};

const getCards = async (req, res) => {
  try {
    const filter = {};
    if (req.query.statusList) filter.statusList = req.query.statusList;
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.userId) filter.userId = req.query.userId;
    const cards = await cardServices.getCards(filter);
    httpResponse(
      res,
      generalStatus.SUCCESS,
      cards.map((card) => cardDto.toDTO(card)),
    );
  } catch (error) {
    httpResponseError(res, error);
  }
};

const updateCard = async (req, res) => {
  try {
    const cardInput = req.body?.data;
    if (!cardInput) {
      httpResponseError(res, generalStatus.BAD_REQUEST, "data is required");
      return;
    }
    const update = cardDto.toEntity(cardInput);
    if (update._id) delete update._id;

    const card = await cardServices.updateCard(req.params.id, update);
    if (!card) {
      httpResponseError(res, generalStatus.NOT_FOUND, "Card not found");
      return;
    }
    httpResponse(res, generalStatus.SUCCESS, cardDto.toDTO(card));
  } catch (error) {
    httpResponseError(res, error);
  }
};

const deleteCard = async (req, res) => {
  try {
    const deleted = await cardServices.deleteCard(req.params.id);
    if (!deleted) {
      httpResponseError(res, generalStatus.NOT_FOUND, "Card not found");
      return;
    }
    httpResponse(res, generalStatus.SUCCESS, { message: "Card deleted" });
  } catch (error) {
    httpResponseError(res, error);
  }
};

export { createCard, getCard, getCards, updateCard, deleteCard };
