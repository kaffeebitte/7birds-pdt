import { Router } from "express";
import {
  getMembers,
  getMemberBySlug,
  updateMember,
} from "../controllers/member.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, getMembers);
router.get("/:slug", requireAuth, getMemberBySlug);
router.patch("/:slug", requireAuth, updateMember);

export default router;
