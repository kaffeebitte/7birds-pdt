import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import {
  findMembers,
  findMemberBySlug,
  updateMemberBySlug,
} from "../services/member.service.js";

export async function getMembers(req: Request, res: Response) {
  try {
    const members = await findMembers();

    return res.json(members);
  } catch (error) {
    console.error("Get members error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load members",
    });
  }
}

export async function getMemberBySlug(req: Request, res: Response) {
  const { slug } = req.params;

  if (typeof slug !== "string" || !slug.trim()) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing slug parameter",
    });
  }

  const member = await findMemberBySlug(slug);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: "Member not found",
    });
  }

  res.json(member);
}

export async function updateMember(req: AuthenticatedRequest, res: Response) {
  const { slug } = req.params;

  if (typeof slug !== "string" || !slug.trim()) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing slug parameter",
    });
  }

  if (!req.auth) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({
      success: false,
      message: "Invalid request body",
    });
  }

  const allowedFields = ["displayName", "bio", "instagram", "spotifyUrl"];

  const hasInvalidField = Object.keys(req.body).some(
    (key) => !allowedFields.includes(key),
  );

  if (hasInvalidField) {
    return res.status(400).json({
      success: false,
      message: "Invalid profile field",
    });
  }

  const member = await findMemberBySlug(slug);

  if (!member) {
    return res.status(404).json({
      success: false,
      message: "Member not found",
    });
  }

  if (member.userId !== req.auth.userId) {
    return res.status(403).json({
      success: false,
      message: "You can only edit your own profile",
    });
  }

  const { displayName, bio, instagram, spotifyUrl } = req.body;

  if (
    displayName !== undefined &&
    (typeof displayName !== "string" || !displayName.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Display name cannot be empty",
    });
  }

  if (bio !== undefined && bio != null && typeof bio !== "string") {
    return res.status(400).json({
      success: false,
      message: "Bio must me a string",
    });
  }

  if (
    instagram !== undefined &&
    instagram !== null &&
    typeof instagram !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Instagram account must be a string",
    });
  }

  if (
    spotifyUrl !== undefined &&
    spotifyUrl !== null &&
    typeof spotifyUrl !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Spotify URL must be a string",
    });
  }
  const data = {
    ...(displayName !== undefined && { displayName: displayName.trim() }),
    ...(bio !== undefined && {
      bio: typeof bio === "string" && bio.trim() ? bio.trim() : null,
    }),
    ...(instagram !== undefined && {
      instagram:
        typeof instagram === "string" && instagram.trim()
          ? instagram.trim().replace(/^@/, "")
          : null,
    }),
    ...(spotifyUrl !== undefined && {
      spotifyUrl: spotifyUrl === null ? null : normalizeSpotifyUrl(spotifyUrl),
    }),
  };

  try {
    const updatedMember = await updateMemberBySlug(slug, data);

    return res.json(updatedMember);
  } catch (error) {
    console.log("Update member error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update member",
    });
  }
}

function normalizeSpotifyUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("https://open.spotify.com/embed/")) {
    return trimmed;
  }

  if (trimmed.startsWith("https://open.spotify.com/")) {
    return trimmed.replace(
      "https://open.spotify.com",
      "https://open.spotify.com/embed/",
    );
  }

  throw new Error("Invalid Spotify URL");
}
