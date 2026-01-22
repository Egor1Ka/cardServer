import express from "express";
import {
  createModule,
  getModules,
  getModule,
} from "../../controllers/moduleController.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.any(), createModule);
router.get("/", getModules);
router.get("/:id", getModule);

export default router;
