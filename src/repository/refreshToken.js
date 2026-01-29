import RefreshToken from "../models/RefreshToken.js";

const createRefreshToken = async (data) => {
  return await RefreshToken.create(data);
};

const getRefreshToken = async (token) => {
  return await RefreshToken.findOne({ token });
};

export default {
  createRefreshToken,
  getRefreshToken,
};
