import axios from "axios";
import { create } from "zustand";
import { clearStoredToken, getStoredToken } from "../../../lib/api";
import { getMe, login, type AuthUser, type LoginInput } from "../api/authApi";

type AuthState = {
  user: AuthUser | null;
  isCheckingAuth: boolean;
  isLoggingIn: boolean;
  loginError: string | null;
  checkAuth: () => Promise<void>;
  login: (input: LoginInput) => Promise<boolean>;
  logout: () => void;
  setLoginError: (message: string) => void;
  clearLoginError: () => void;
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;

    if (typeof message === "string") {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isCheckingAuth: false,
  isLoggingIn: false,
  loginError: null,

  checkAuth: async () => {
    const token = getStoredToken();

    if (!token) {
      set({
        user: null,
        isCheckingAuth: false,
      });

      return;
    }

    set({ isCheckingAuth: true });

    try {
      const user = await getMe();

      set({
        user,
        isCheckingAuth: false,
      });
    } catch {
      clearStoredToken();

      set({
        user: null,
        isCheckingAuth: false,
      });
    }
  },

  login: async (input) => {
    set({
      isLoggingIn: true,
      loginError: null,
    });

    try {
      const result = await login(input);

      set({
        user: result.user,
        isLoggingIn: false,
      });

      return true;
    } catch (error) {
      clearStoredToken();

      set({
        user: null,
        isLoggingIn: false,
        loginError: getErrorMessage(error),
      });

      return false;
    }
  },

  logout: () => {
    clearStoredToken();

    set({
      user: null,
      loginError: null,
    });
  },

  setLoginError: (message) => {
    set({ loginError: message });
  },

  clearLoginError: () => {
    set({ loginError: null });
  },
}));
