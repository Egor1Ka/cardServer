import userRepository from "../repository/user.js";

const createUser = async (data) => {
  return await userRepository.createUser(data);
};

const getUserById = async (id) => {
  return await userRepository.getUserById(id);
};

const getUsers = async (filter = {}) => {
  return await userRepository.getUsers(filter);
};

const updateUser = async (id, update) => {
  return await userRepository.updateUser(id, update);
};

const deleteUser = async (id) => {
  return await userRepository.deleteUser(id);
};

export default {
  createUser,
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
};
