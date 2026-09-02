import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../middlewares/auth.middleware.js";
import {
  findMembers,
  findMemberBySlug,
  updateMemberBySlug,
} from "../services/member.service.js";
import {
  isProfileElement,
  normalizeProfileElements,
} from "../utils/profile-elements.js";
import type { ProfileElement } from "../types/profile-elements.js";
import {
  uploadProfileImageToCloudinary,
  deleteProfileImageFromCloudinary,
} from "../services/cloudinary.service.js";
import { PROFILE_IMAGE_LIMIT } from "../config/limits.js";

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

  const allowedFields = [
    "displayName",
    "bio",
    "instagram",
    "spotifyUrl",
    "elements",
  ];

  const hasInvalidField = Object.keys(req.body).some(
    (key) => !allowedFields.includes(key),
  );

  if (hasInvalidField) {
    return res.status(400).json({
      success: false,
      message: "Invalid profile field",
    });
  }

  let member;

  try {
    member = await findMemberBySlug(slug);
  } catch (error) {
    console.error("Find member error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load member",
    });
  }

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

  const { displayName, bio, instagram, spotifyUrl, elements } = req.body;

  if (
    displayName !== undefined &&
    (typeof displayName !== "string" || !displayName.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Display name cannot be empty",
    });
  }

  if (bio !== undefined && bio !== null && typeof bio !== "string") {
    return res.status(400).json({
      success: false,
      message: "Bio must be a string",
    });
  }

  let normalizedInstagram: string | null = null;

  if (instagram !== undefined) {
    if (instagram === null) {
      normalizedInstagram = null;
    } else {
      if (typeof instagram !== "string") {
        return res.status(400).json({
          success: false,
          message: "Instagram account must be a string",
        });
      }

      const trimmed = instagram.trim().replace(/^@/, "");

      if (trimmed && !/^[a-zA-Z0-9._]+$/.test(trimmed)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Instagram username",
        });
      }

      normalizedInstagram = trimmed || null;
    }
  }

  let normalizedSpotifyUrl: string | null = null;

  if (spotifyUrl !== undefined) {
    if (spotifyUrl === null) {
      normalizedSpotifyUrl = null;
    } else {
      if (typeof spotifyUrl !== "string") {
        return res.status(400).json({
          success: false,
          message: "Spotify URL must be a string",
        });
      }

      normalizedSpotifyUrl = normalizeSpotifyUrl(spotifyUrl);

      if (normalizedSpotifyUrl === null && spotifyUrl.trim()) {
        return res.status(400).json({
          success: false,
          message: "Invalid Spotify URL",
        });
      }
    }
  }

  let normalizedElements: ProfileElement[] | undefined;

  if (elements !== undefined) {
    if (!Array.isArray(elements)) {
      return res.status(400).json({
        success: false,
        message: "Elements must be an array",
      });
    }

    const hasInvalidElement = elements.some(
      (element) => !isProfileElement(element),
    );

    if (hasInvalidElement) {
      return res.status(400).json({
        success: false,
        message: "Invalid profile element",
      });
    }

    normalizedElements = normalizeProfileElements(elements);

    const imageCount = normalizedElements.filter(
      (element) => element.type === "image",
    ).length;

    if (imageCount > PROFILE_IMAGE_LIMIT) {
      return res.status(400).json({
        success: false,
        message: `Profile can have at most ${PROFILE_IMAGE_LIMIT} images`,
      });
    }
  }

  const data = {
    ...(displayName !== undefined && { displayName: displayName.trim() }),
    ...(bio !== undefined && {
      bio: typeof bio === "string" && bio.trim() ? bio.trim() : null,
    }),
    ...(instagram !== undefined && {
      instagram: normalizedInstagram,
    }),
    ...(spotifyUrl !== undefined && {
      spotifyUrl: normalizedSpotifyUrl,
    }),
    ...(normalizedElements !== undefined && {
      elements: normalizedElements,
    }),
  };

  try {
    const updatedMember = await updateMemberBySlug(slug, data);

    return res.json(updatedMember);
  } catch (error) {
    console.error("Update member error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update member",
    });
  }
}

export async function uploadProfileImage(
  req: AuthenticatedRequest,
  res: Response,
) {
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

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Image file is required",
    });
  }

  let member;

  try {
    member = await findMemberBySlug(slug);
  } catch (error) {
    console.error("Find member error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load member",
    });
  }

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

  const imageCount = member.elements.filter(
    (element) => element.type === "image",
  ).length;

  if (imageCount >= PROFILE_IMAGE_LIMIT) {
    return res.status(400).json({
      success: false,
      message: "Profile image limit reached",
    });
  }

  const result = await uploadProfileImageToCloudinary(req.file.buffer);

  return res.status(200).json({
    url: result.secure_url,
    publicId: result.public_id,
  });
}

export async function deleteProfileImage(
  req: AuthenticatedRequest,
  res: Response,
) {
  const { slug } = req.params;
  const { publicId } = req.body;

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

  if (typeof publicId !== "string" || !publicId.trim()) {
    return res.status(400).json({
      success: false,
      message: "publicId is required",
    });
  }

  let member;

  try {
    member = await findMemberBySlug(slug);
  } catch (error) {
    console.error("Find member error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete file",
    });
  }

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

  const imageElement = member.elements.find(
    (element) => element.type === "image" && element.publicId == publicId,
  );

  if (!imageElement) {
    return res.status(404).json({
      success: false,
      message: "Image not found in profile",
    });
  }

  const nextElements = member.elements.filter(
    (element) => element.id !== imageElement.id,
  );

  try {
    await deleteProfileImageFromCloudinary(publicId);
    await updateMemberBySlug(slug, { elements: nextElements });
  } catch (error) {
    console.error("Delete profile image error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete image",
    });
  }

  return res.status(200).json({
    success: true,
  });
}

function normalizeSpotifyUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const match = trimmed.match(
    /^https:\/\/open\.spotify\.com\/(?:embed\/)?(track|album|playlist)\/([^/?#]+)/,
  );

  if (!match) return null;

  const [, type, id] = match;
  return `https://open.spotify.com/embed/${type}/${id}`;
}
