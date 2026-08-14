import { Router } from "express";
import { getMe, login } from "../controllers/auth.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();
router.post("/login", login);
router.get("/me", requireAuth, getMe); //bắt buộc chạy qua requireAuth trước khi vào getMe

export default router;
