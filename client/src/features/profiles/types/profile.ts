export type ProfileSummary = {
  slug: string;
  displayName: string;
  avatarUrl: string;
};

export type ProfileDetail = {
  id: string;
  slug: string;
  displayName: string;
  avatarUrl: string;
  bio?: string;
  birthday?: string;
  instagram?: string;
  spotifyUrl?: string;
  element?: Record<string, unknown>;
};
