import {
  type SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { getLoginOptions, type LoginOption } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export function AuthPage() {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const [loginOptions, setLoginOptions] = useState<LoginOption[]>([]);
  const [selectedUser, setSelectedUser] = useState<LoginOption | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const [logoClickCount, setLogoClickCount] = useState(0);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const login = useAuthStore((state) => state.login);
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
  const loginError = useAuthStore((state) => state.loginError);
  const setLoginError = useAuthStore((state) => state.setLoginError);
  const clearLoginError = useAuthStore((state) => state.clearLoginError);

  const [password, setPassword] = useState("");

  useEffect(() => {
    let isMounted = true;

    getLoginOptions()
      .then((members) => {
        if (isMounted) {
          setLoginOptions(members);
          setOptionsError(null);
          setIsLoadingOptions(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setOptionsError("Unable to load members");
          setIsLoadingOptions(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  function handleSelectUser(option: LoginOption) {
    if (selectedUser?.userId === option.userId) {
      setSelectedUser(null);
      setPassword("");
    } else {
      setSelectedUser(option);
      if (password) setPassword("");
      inputRef.current?.focus();
    }
    setIsAdminMode(false);
    setLogoClickCount(0);
    clearLoginError();
  }

  function handleLogoClick() {
    if (isAdminMode) {
      setIsAdminMode(false);
      setLogoClickCount(0);
      setPassword("");
      clearLoginError();
      return;
    }

    const nextCount = logoClickCount + 1;
    setLogoClickCount(nextCount);

    if (nextCount >= 7) {
      setIsAdminMode(true);
      setSelectedUser(null);
      setLogoClickCount(0);
      if (password) setPassword("");
      clearLoginError();
      inputRef.current?.focus();
    }
  }

  // Keep focus on input when active
  useEffect(() => {
    if (selectedUser || isAdminMode) {
      inputRef.current?.focus();
    }
  }, [selectedUser, isAdminMode]);

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

    const userId = isAdminMode
      ? import.meta.env.VITE_ADMIN_USER_ID
      : selectedUser?.userId;

    if (!userId) {
      setLoginError("Admin login is not configured");
      return;
    }

    const isSuccess = await login({
      userId,
      password,
    });

    if (isSuccess) {
      navigate("/home", { replace: true });
    }
  }

  return (
    <main className="page-shell flex min-h-screen flex-col items-center justify-center text-center">
      <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-10">
        <div>
          <button
            type="button"
            onClick={handleLogoClick}
            className="brand-mark text-6xl md:text-7xl cursor-pointer select-none"
          >
            7birds
          </button>
        </div>

        {isLoadingOptions ? (
          <p className="mono-label">Loading members...</p>
        ) : null}

        {optionsError ? (
          <p className="mono-label text-bird-pink">{optionsError}</p>
        ) : null}

        {/* Avatars Grid */}
        <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-7 justify-items-center items-end">
          {loginOptions.map((option) => {
            const isSelected = selectedUser?.userId === option.userId;

            return (
              <button
                key={option.userId}
                type="button"
                onClick={() => handleSelectUser(option)}
                className={`group flex flex-col items-center gap-2 text-center cursor-pointer transition-all duration-200 ${
                  (selectedUser && !isSelected) || isAdminMode
                    ? "opacity-35 hover:opacity-75"
                    : "opacity-100"
                }`}
              >
                <img
                  src={option.avatarUrl}
                  alt={option.slug}
                  className={`h-24 w-24 sm:h-28 sm:w-28 object-contain transition-all duration-200 ${
                    isSelected
                      ? "scale-125 -translate-y-2 drop-shadow-md"
                      : "group-hover:scale-105"
                  }`}
                />
                <span
                  className={`mono-label transition-colors ${
                    isSelected
                      ? "text-bird-blue font-bold text-sm"
                      : "group-hover:text-bird-blue"
                  }`}
                >
                  {option.slug}
                </span>
              </button>
            );
          })}
        </div>

        {/* Inline Password Box Underneath */}
        <div className="min-h-[140px] w-full flex items-start justify-center">
          <AnimatePresence>
            {Boolean(selectedUser || isAdminMode) && (
              <motion.form
                key="auth-input-form"
                initial={{ opacity: 0, y: -14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                transition={{
                  duration: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                onSubmit={handleSubmit}
                className="w-full max-w-xs flex flex-col items-center gap-3"
              >
                <p className="mono-label text-xs">
                  {isAdminMode
                    ? "Admin Password"
                    : `Password for ${selectedUser?.slug}`}
                </p>

                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Password"
                  className="ink-input w-full text-center font-mono"
                  required
                />

                {loginError ? (
                  <p className="mono-label text-xs text-bird-pink">{loginError}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="ink-button w-full"
                >
                  {isLoggingIn ? "Logging in..." : "Login"}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
