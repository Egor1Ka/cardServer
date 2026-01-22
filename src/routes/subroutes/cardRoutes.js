import express from "express";
import {
  createCard,
  getCard,
  getCards,
  getCardsByModule,
  updateCard,
  deleteCard,
} from "../../controllers/cardController.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/", upload.none(), createCard);
router.get("/", getCards);
router.get("/module/:moduleId", getCardsByModule);
router.get("/:id", getCard);
router.put("/:id", upload.none(), updateCard);
router.delete("/:id", deleteCard);

export default router;
