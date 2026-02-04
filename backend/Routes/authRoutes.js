import express from "express";
import { googleLogin } from "../Controllers/authController.js";

const router = express.Router();

router.post("/google", googleLogin);

export default router;
