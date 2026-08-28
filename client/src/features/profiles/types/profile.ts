import type { ProfileElement } from "./elements";

export type ProfileSummary = {
  slug: string;
  displayName: string;
  avatarUrl: string;
};

export type ProfileDetail = {
  id: string;
  userId: string;
  slug: string;
  displayName: string;
  avatarUrl: string;
  bio: string | null;
  birthday: string | null;
  instagram: string | null;
  spotifyUrl: string | null;
  elements: ProfileElement[];
};

export type UpdateProfileInput = {
  displayName?: string;
  bio?: string | null;
  instagram?: string | null;
  spotifyUrl?: string | null;
  elements?: ProfileElement[];
};
