import { Router } from "express";
import {
  getMembers,
  getMemberBySlug,
} from "../controllers/member.controller.js";

const router = Router();

router.get("/", getMembers);
router.get("/:slug", getMemberBySlug);

export default router;
