import { Router } from "express";
import {
  getMembers,
  getMemberBySlug,
  updateMember,
  deleteProfileImage,
} from "../controllers/member.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { uploadSingleImage } from "../middlewares/upload.middleware.js";
import { uploadProfileImage } from "../controllers/member.controller.js";

const router = Router();

router.get("/", requireAuth, getMembers);
router.get("/:slug", requireAuth, getMemberBySlug);
router.patch("/:slug", requireAuth, updateMember);
router.post(
  "/:slug/images",
  requireAuth,
  uploadSingleImage,
  uploadProfileImage,
);
router.delete("/:slug/images", requireAuth, deleteProfileImage);

export default router;
