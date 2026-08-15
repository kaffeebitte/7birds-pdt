import { api, setStoredToken } from "../../../lib/api";

export type Role = "ADMIN" | "MEMBER";

export type Member = {
  id: string;
  userId: string;
  slug: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  birthday: string | null;
  instagram: string | null;
  spotifyUrl: string | null;
  elements: unknown;
  createdAt: string;
  updatedAt: string;
};

export type AuthUser = {
  id: string;
  role: Role;
  member: Member | null;
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export type LoginInput = {
  userId: string;
  password: string;
};

export type LoginResult = {
  token: string;
  user: AuthUser;
};

export async function login(input: LoginInput) {
  const response = await api.post<ApiResponse<LoginResult>>(
    "/auth/login",
    input,
  );
  const result = response.data.data;

  setStoredToken(result.token);

  return result;
}

export async function getMe() {
  const response = await api.get<ApiResponse<{ user: AuthUser }>>("/auth/me");
  return response.data.data.user;
}
