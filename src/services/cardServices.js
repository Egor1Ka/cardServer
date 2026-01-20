import cardRepository from "../repository/card.js";
import { resolveImageSource } from "../utils/img.js";

const mapToCard = (data, frontImage, backImage) => ({
  ...data,
  ...(data?.front
    ? { front: { ...data.front, img: frontImage ?? data.front.img } }
    : {}),
  ...(data?.back
    ? { back: { ...data.back, img: backImage ?? data.back.img } }
    : {}),
});

const createCard = async (data, options = {}) => {
  const { back, front } = data;

  const { img: frontImg } = front;
  const { img: backImg } = back;

  const frontImage = (await resolveImageSource(frontImg)) ?? frontImg;
  const backImage = (await resolveImageSource(backImg)) ?? backImg;

  const normalized = await mapToCard(data, frontImage, backImage);
  return await cardRepository.createCard(normalized, options);
};

const getCardById = async (id) => {
  return await cardRepository.getCardById(id);
};

const getCards = async (filter = {}) => {
  return await cardRepository.getCards(filter);
};

const updateCard = async (id, update) => {
  const frontImg = update?.front?.img;
  const backImg = update?.back?.img;

  const frontImage = frontImg
    ? ((await resolveImageSource(frontImg)) ?? frontImg)
    : undefined;
  const backImage = backImg
    ? ((await resolveImageSource(backImg)) ?? backImg)
    : undefined;

  const normalized = mapToCard(update, frontImage, backImage);
  return await cardRepository.updateCard(id, normalized);
};

const deleteCard = async (id) => {
  return await cardRepository.deleteCard(id);
};

export default {
  createCard,
  getCardById,
  getCards,
  updateCard,
  deleteCard,
};
