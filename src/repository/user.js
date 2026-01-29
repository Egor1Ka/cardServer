import User from "../models/User.js";

const createUser = async (user) => {
  return await User.create(user);
};

const getUserById = async (id) => {
  return await User.findById(id);
};

const getUsers = async (filter = {}) => {
  return await User.find(filter);
};

const getUser = async (filter = {}) => {
  return await User.findOne(filter);
};

const updateUser = async (id, update) => {
  return await User.findByIdAndUpdate(id, update, { new: true });
};

const deleteUser = async (id) => {
  return await User.findByIdAndDelete(id);
};

export default {
  createUser,
  getUserById,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
