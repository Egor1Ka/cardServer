import Module from "../models/Module.js";

const createModule = async (moduleData, options = {}) => {
  const { session } = options;
  if (session) {
    const [created] = await Module.create([moduleData], { session });
    return created;
  }
  return await Module.create(moduleData);
};

const updateModule = async (id, update, options = {}) => {
  const { session } = options;
  return await Module.findByIdAndUpdate(id, update, {
    new: true,
    session,
  });
};

const getModules = async (filter = {}) => {
  return await Module.find(filter).populate("createdBy");
};

const getModuleById = async (id) => {
  return await Module.findById(id).populate("createdBy");
};

export default {
  createModule,
  updateModule,
  getModules,
  getModuleById,
};
