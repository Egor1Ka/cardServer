import authServices from "../services/auth/authServices.js";
import { httpResponse } from "../utils/http/httpResponse.js";
import { generalStatus } from "../utils/http/httpStatus.js";
import userServices from "./../services/userServices.js";
import {
  stateCookieOptions,
  accessCookieOptions,
  refreshCookieOptions,
} from "../utils/auth.js";
import refreshTokenRepository from "../repository/refreshToken.js";

const STATE_COOKIE_NAME = "google_oauth_state";
const GOOGLE_PROVIDER = "google";

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

const googleAuthRedirect = async (req, res) => {
  try {
    const state = authServices.createOauthState();
    const authUrl = authServices.google.buildGoogleAuthUrl(state);
    res.cookie(STATE_COOKIE_NAME, state, stateCookieOptions);
    res.redirect(authUrl);
  } catch (error) {
    console.error(error);
    httpResponse(res, generalStatus.ERROR);
  }
};

const googleAuthCallback = async (req, res) => {
  try {
    const code = req.query.code;
    const state = req.query.state;

    const storedState = req.cookies?.[STATE_COOKIE_NAME];

    if (!code || !state || !storedState || storedState !== state) {
      httpResponse(res, generalStatus.BAD_REQUEST, {
        message: "Invalid OAuth state",
      });
      return;
    }

    res.clearCookie(STATE_COOKIE_NAME, stateCookieOptions);

    const tokens = await authServices.google.exchangeGoogleCode(code);
    const profile = await authServices.google.getGoogleProfile(tokens);

    const { email, picture } = profile;

    const userCandidate = await userServices.getUser({ email });
    const user =
      userCandidate ||
      (await userServices.createUser({
        name: profile.name || email,
        email,
        avatar: picture,
      }));

    if (userCandidate && !userCandidate.avatar && picture) {
      await userServices.updateUser(userCandidate._id, { avatar: picture });
    }

    const { accessToken, refreshToken } = await authServices.createTokens(
      user,
      GOOGLE_PROVIDER,
    );

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessCookieOptions);
    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshCookieOptions);

    const frontendUrl = process.env.FRONTEND_URL;
    if (!frontendUrl) {
      httpResponse(res, generalStatus.ERROR);
      return;
    }

    res.redirect(frontendUrl);
  } catch (error) {
    console.error(error);
    httpResponse(res, generalStatus.ERROR);
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      httpResponse(res, generalStatus.UNAUTHORIZED, {
        message: "Refresh token missing",
      });
      return;
    }

    const stored = await refreshTokenRepository.getRefreshToken(refreshToken);
    if (!stored || (stored.expiresAt && stored.expiresAt <= new Date())) {
      httpResponse(res, generalStatus.UNAUTHORIZED, {
        message: "Refresh token invalid",
      });
      return;
    }

    const user = await userServices.getUserById(stored.providerUserId);
    if (!user) {
      httpResponse(res, generalStatus.UNAUTHORIZED, {
        message: "User not found",
      });
      return;
    }

    const accessToken = authServices.createAccessToken(user, stored.provider);
    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, accessCookieOptions);

    httpResponse(res, generalStatus.SUCCESS, {
      accessToken,
    });
  } catch (error) {
    console.error(error);
    httpResponse(res, generalStatus.ERROR);
  }
};

export { googleAuthRedirect, googleAuthCallback, refreshAccessToken };
