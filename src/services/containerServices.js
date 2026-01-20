import mongoose from "mongoose";
import containerRepository from "../repository/container.js";
import cardServices from "./cardServices.js";
import cardDto from "../dto/cardDto.js";

const createContainerWithCards = async (containerInput, cardsInput = []) => {
  const session = await mongoose.startSession();
  let result;

  try {
    await session.withTransaction(async () => {
      const { name, description } = containerInput;
      const container = await containerRepository.createContainer(
        { name, description },
        { session },
      );

      const createdCards = [];

      for (const cardInput of cardsInput) {
        const cardEntity = cardDto.toEntity(cardInput);
        const cardWithContainer = {
          ...cardEntity,
          containers: [container._id],
        };
        const created = await cardServices.createCard(cardWithContainer, {
          session,
        });
        createdCards.push(created);
      }

      const cardIds = createdCards.map((card) => card._id);
      const updatedContainer = await containerRepository.updateContainer(
        container._id,
        { cards: cardIds },
        { session },
      );

      result = { container: updatedContainer, cards: createdCards };
    });
  } finally {
    session.endSession();
  }

  return result;
};

export default {
  createContainerWithCards,
};
