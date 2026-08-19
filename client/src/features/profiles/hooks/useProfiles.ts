import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfileBySlug,
  getProfiles,
  updateProfile,
} from "../api/profileApi";
import type { UpdateProfileInput } from "../types/profile";

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

export function useUpdateProfile(slug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => updateProfile(slug, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", slug],
      });
    },
  });
}
