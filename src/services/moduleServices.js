import mongoose from "mongoose";
import moduleRepository from "../repository/module.js";
import cardServices from "./cardServices.js";
import cardDto from "../dto/cardDto.js";

const createModuleWithCards = async (moduleInput, cardsInput = []) => {
  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      const { name, description, createdBy } = moduleInput;

      const moduleDoc = await moduleRepository.createModule(
        { name, description, createdBy },
        { session },
      );

      const createdCards = [];

      for (const cardInput of cardsInput) {
        const cardEntity = cardDto.toEntity(cardInput);
        const cardWithModule = {
          ...cardEntity,
          modules: [moduleDoc._id],
        };
        const created = await cardServices.createCard(cardWithModule, {
          session,
        });
        createdCards.push(created);
      }

      const cardIds = createdCards.map((card) => card._id);
      const updatedModule = await moduleRepository.updateModule(
        moduleDoc._id,
        { cards: cardIds },
        { session },
      );

      result = { module: updatedModule, cards: createdCards };
    });
  } finally {
    session.endSession();
  }

  return result;
};

const getModules = async (filter = {}) => {
  return await moduleRepository.getModules(filter);
};

const getModuleById = async (id) => {
  return await moduleRepository.getModuleById(id);
};

export default {
  createModuleWithCards,
  getModules,
  getModuleById,
};
