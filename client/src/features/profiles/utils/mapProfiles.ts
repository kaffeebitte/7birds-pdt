import { profileLayout } from "../data/profileLayout";
import type { ProfileSummary } from "../api/profileApi";

export function mapProfile(profiles: ProfileSummary[]) {
  return profiles.map((profile) => ({
    ...profile,
    position: profileLayout[profile.slug]?.position,
    namePosition: profileLayout[profile.slug]?.namePosition,
  }));
}
