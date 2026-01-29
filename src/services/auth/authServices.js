import crypto from "crypto";
import jwt from "jsonwebtoken";
import {
  buildGoogleAuthUrl,
  exchangeGoogleCode,
  getGoogleProfile,
} from "./google.js";
import refreshTokenRepository from "../../repository/refreshToken.js";
import {
  STATE_BYTES,
  REFRESH_BYTES,
  DEFAULT_REFRESH_EXPIRES_MS,
  parseDurationMs,
} from "../../utils/auth.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES;
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES;

const createOauthState = () => crypto.randomBytes(STATE_BYTES).toString("hex");

const createTokens = async (user, provider) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }
  const userId = user?.sub || user?._id || user?.id;
  if (!userId) {
    throw new Error("User id is required");
  }

  const accessExpires = JWT_ACCESS_EXPIRES;
  const refreshExpires = JWT_REFRESH_EXPIRES;

  const accessToken = jwt.sign(
    {
      id: userId.toString(),
      provider,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: accessExpires },
  );

  const refreshToken = crypto.randomBytes(REFRESH_BYTES).toString("hex");
  const refreshExpiresAt = new Date(
    Date.now() + parseDurationMs(refreshExpires, DEFAULT_REFRESH_EXPIRES_MS),
  );

  await refreshTokenRepository.createRefreshToken({
    token: refreshToken,
    provider,
    providerUserId: userId.toString(),
    expiresAt: refreshExpiresAt,
  });

  return { accessToken, refreshToken };
};

const createAccessToken = (user, provider) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }
  const userId = user?.sub || user?._id || user?.id;
  if (!userId) {
    throw new Error("User id is required");
  }
  return jwt.sign(
    {
      id: userId.toString(),
      provider,
      email: user.email,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: JWT_ACCESS_EXPIRES },
  );
};

const verifyAccessToken = (token) => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is required");
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, reason: error?.name || "invalid" };
  }
};

export default {
  createOauthState,
  google: {
    buildGoogleAuthUrl,
    exchangeGoogleCode,
    getGoogleProfile,
  },
  createTokens,
  createAccessToken,
  verifyAccessToken,
};
