import { Router } from "express";
import { getMe, login } from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/login", login);
router.get("/me", requireAuth, getMe);

export default router;
