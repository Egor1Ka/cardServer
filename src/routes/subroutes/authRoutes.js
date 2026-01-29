import express from "express";
import {
  googleAuthRedirect,
  googleAuthCallback,
  refreshAccessToken,
} from "../../controllers/authController.js";

const router = express.Router();

router.get("/google", googleAuthRedirect);
router.get("/google/callback", googleAuthCallback);
router.post("/refresh", refreshAccessToken);

export default router;
