import express from "express";
import { createContainer } from "../../controllers/containerController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.any(), createContainer);

export default router;
