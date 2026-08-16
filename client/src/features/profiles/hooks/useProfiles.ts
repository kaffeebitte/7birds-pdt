import { useQuery } from "@tanstack/react-query";
import { getProfileBySlug, getProfiles } from "../api/profileApi";

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: getProfiles,
  });
}

export function useProfile(slug: string) {
  return useQuery({
    queryKey: ["profile", slug],
    queryFn: () => getProfileBySlug(slug),
    enabled: Boolean(slug),
  });
}
