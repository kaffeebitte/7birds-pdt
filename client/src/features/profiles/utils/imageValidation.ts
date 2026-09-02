import {
  ALLOWED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
} from "../constants/profileLimits";

export function validateProfileImage(file: File): string | null {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number],
    )
  ) {
    return "Only JPEG, JPG, and PNG images are allowed";
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return "Image size must be 5 MB or smaller";
  }

  return null;
}
