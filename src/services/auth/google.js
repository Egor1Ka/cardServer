import { Google } from "../../bus/index.js";

export const buildGoogleAuthUrl = (state) => {
  return Google.buildAuthUrl(state);
};

export const exchangeGoogleCode = async (code) => {
  return await Google.exchangeCode(code);
};

export const getGoogleProfile = async (tokens) => {
  return await Google.getProfile(tokens);
};
