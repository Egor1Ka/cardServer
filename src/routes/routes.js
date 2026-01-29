import express from "express";
import { httpResponse } from "../utils/http/httpResponse.js";
import { generalStatus } from "../utils/http/httpStatus.js";
import cardRoutes from "./subroutes/cardRoutes.js";
import moduleRoutes from "./subroutes/moduleRoutes.js";
import userRoutes from "./subroutes/userRoutes.js";
import authRoutes from "./subroutes/authRoutes.js";
import auth from "./../middleware/auth.js";

const router = express.Router();

router.get("/", (req, res) => {
  httpResponse(res, generalStatus.SUCCESS);
});

router.use("/cards", auth, cardRoutes);
router.use("/module", moduleRoutes);
router.use("/user", userRoutes);
router.use("/auth", authRoutes);

// router.use("/user", userRoute);

export default router;
