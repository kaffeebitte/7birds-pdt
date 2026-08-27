import type { ProfileElement } from "../types/profile-elements.js";

export function isProfileElement(value: unknown): value is ProfileElement {
  if (!value || typeof value !== "object") {
    return false;
  }

  const element = value as Record<string, unknown>;

  if (
    typeof element.id !== "string" ||
    typeof element.type !== "string" ||
    typeof element.x !== "number" ||
    typeof element.y !== "number" ||
    typeof element.rotation !== "number" ||
    typeof element.zIndex !== "number"
  ) {
    return false;
  }

  if (element.type === "text") {
    return (
      typeof element.content === "string" &&
      (element.width === undefined || typeof element.width === "number")
    );
  }

  if (element.type === "image") {
    return typeof element.url === "string" && typeof element.width === "number";
  }

  return false;
}

export function normalizeProfileElements(value: unknown): ProfileElement[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isProfileElement).map((element) => ({
    ...element,
    width: element.width ?? 250,
  }));
}
