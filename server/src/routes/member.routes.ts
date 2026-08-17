import { Router } from "express";
import {
  getMembers,
  getMemberBySlug,
} from "../controllers/member.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getMembers);
router.get("/:slug", requireAuth, getMemberBySlug);

export default router;
