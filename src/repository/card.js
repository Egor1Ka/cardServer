import Card from "../models/Card.js";

const createCard = async (card, options = {}) => {
  const { session } = options;
  if (session) {
    const [created] = await Card.create([card], { session });
    return created;
  }
  return await Card.create(card);
};

const getCardById = async (id) => {
  return await Card.findById(id).populate("userId");
};

const getCards = async (filter) => {
  return await Card.find(filter).populate("userId");
};

const updateCard = async (id, update) => {
  return await Card.findByIdAndUpdate(id, update, { new: true });
};

const deleteCard = async (id) => {
  return await Card.findByIdAndDelete(id);
};

export default {
  createCard,
  getCardById,
  getCards,
  updateCard,
  deleteCard,
};
