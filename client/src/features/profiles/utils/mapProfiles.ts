import { profileLayout } from "../data/profileLayout";
import type { ProfileSummary } from "../types/profile";

export function mapProfile(profiles: ProfileSummary[]) {
  return profiles.flatMap((profile) => {
    const layout = profileLayout[profile.slug];
    if (!layout) return [];

    return [
      {
        ...profile,
        position: layout.position,
        namePosition: layout.namePosition,
      },
    ];
  });
}
