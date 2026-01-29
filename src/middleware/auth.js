import authServices from "../services/auth/authServices.js";
import { httpResponse } from "../utils/http/httpResponse.js";
import { loginStatus } from "../utils/http/httpStatus.js";
import { parseAuthToken } from "../utils/http/httpUtils.js";

const authMiddleware = (req, res, next) => {
  try {
    console.log(req.headers);
    const bearerToken = parseAuthToken(req.headers.authorization);
    const token = bearerToken;

    if (!token) {
      console.log("token", token);
      httpResponse(res, loginStatus.UNAUTHORIZED);
      return;
    }

    const result = authServices.verifyAccessToken(token);
    if (!result.valid) {
      console.log("result", result);
      console.error("authMiddleware error:", result.reason);
      httpResponse(res, loginStatus.UNAUTHORIZED, { reason: result.reason });
      return;
    }

    req.user = result.payload;
    next();
  } catch (error) {
    console.error("authMiddleware exception:", error);
    httpResponse(res, loginStatus.UNAUTHORIZED, { reason: "exception" });
  }
};

export default authMiddleware;
