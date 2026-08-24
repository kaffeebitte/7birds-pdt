import { api } from "../../../lib/api";
import type {
  ProfileSummary,
  ProfileDetail,
  UpdateProfileInput,
} from "../types/profile";

export async function getProfiles() {
  const response = await api.get<ProfileSummary[]>("/members");

  return response.data;
}

export async function getProfileBySlug(slug: string) {
  const response = await api.get<ProfileDetail>(`/members/${slug}`);

  return response.data;
}

export async function updateProfile(
  slug: string,
  data: UpdateProfileInput,
): Promise<ProfileDetail> {
  const response = await api.patch<ProfileDetail>(`/members/${slug}`, data);

  return response.data;
}
