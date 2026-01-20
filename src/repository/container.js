import Container from "../models/Container.js";

const createContainer = async (container, options = {}) => {
  const { session } = options;
  if (session) {
    const [created] = await Container.create([container], { session });
    return created;
  }
  return await Container.create(container);
};

const updateContainer = async (id, update, options = {}) => {
  const { session } = options;
  return await Container.findByIdAndUpdate(id, update, {
    new: true,
    session,
  });
};

export default {
  createContainer,
  updateContainer,
};
