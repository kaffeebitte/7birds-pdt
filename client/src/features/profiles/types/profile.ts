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
  bio?: string;
  birthday?: string;
  instagram?: string;
  spotifyUrl?: string;
  element?: Record<string, unknown>;
};

export type UpdateProfileInput = {
  displayName: string;
  bio: string;
  instagram: string;
  spotifyUrl: string;
};
