import { Router } from "express";
import {
  getMe,
  login,
  getLoginOptions,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
router.get("/login-options", getLoginOptions);
router.post("/login", login);
router.get("/me", requireAuth, getMe);

export default router;
