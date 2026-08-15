import { type SyntheticEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLoginOptions, type LoginOption } from "../api/authApi";
import { useAuthStore } from "../store/authStore";

export function AuthPage() {
  const navigate = useNavigate();

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
    async function loadLoginOptions() {
      try {
        const members = await getLoginOptions();

        setLoginOptions(members);
        setOptionsError(null);
      } catch (error) {
        setOptionsError("Unable to load members");
      } finally {
        setIsLoadingOptions(false);
      }
    }

    void loadLoginOptions();
  }, []);

  function handleSelectUser(option: LoginOption) {
    setSelectedUser(option);
    setPassword("");
    clearLoginError();
  }

  function handleLogoClick() {
    const nextCount = logoClickCount + 1;

    setLogoClickCount(nextCount);

    if (nextCount >= 7) {
      setIsAdminMode(true);
      setSelectedUser(null);
      setPassword("");
      clearLoginError();
    }
  }

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
    <main>
      {isLoadingOptions ? <p>Loading members...</p> : null}
      {optionsError ? <p>{optionsError}</p> : null}

      <button type="button" onClick={handleLogoClick}>
        7birds
      </button>

      <div>
        {loginOptions.map((option) => (
          <button
            key={option.userId}
            type="button"
            onClick={() => handleSelectUser(option)}
          >
            <img
              src={option.avatarUrl}
              alt={option.slug}
              width={80}
              height={80}
            />
            <span>{option.slug}</span>
          </button>
        ))}
      </div>

      {selectedUser || isAdminMode ? (
        <form onSubmit={handleSubmit}>
          <p>{isAdminMode ? "Admin" : selectedUser?.slug}</p>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          {loginError ? <p>{loginError}</p> : null}

          <button type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>
      ) : null}
    </main>
  );
}
