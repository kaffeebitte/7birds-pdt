import { api } from "../../../lib/api";
import type {
  ProfileSummary,
  ProfileDetail,
  UpdateProfileInput,
} from "../types/profile";
import type { UploadProfileImageResponse } from "../types/elements";
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

export async function uploadProfileImage(
  slug: string,
  file: File,
): Promise<UploadProfileImageResponse> {
  const formData = new FormData();

  formData.append("image", file);

  const response = await api.post<UploadProfileImageResponse>(
    `/members/${slug}/images`,
    formData,
  );

  return response.data;
}

export async function deleteProfileImage(
  slug: string,
  publicId: string,
): Promise<void> {
  await api.delete(`/members/${slug}/images`, { data: { publicId } });
}
