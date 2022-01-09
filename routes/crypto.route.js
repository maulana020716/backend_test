import express from "express";
import CryptoController from "../controllers/cryptoController.js";
const router = express.Router();

router.route("/encrypt").post(CryptoController.EncryptText);
router.route("/form").get(CryptoController.FormText);
export default router;
