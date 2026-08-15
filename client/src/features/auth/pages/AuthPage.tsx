import { type SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export function AuthPage() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
  const loginError = useAuthStore((state) => state.loginError);

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: SyntheticEvent) {
    event.preventDefault();

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
      <form onSubmit={handleSubmit}>
        <label>
          User ID
          <input
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
          />
        </label>

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
    </main>
  );
}
