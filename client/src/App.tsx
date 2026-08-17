import { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./App.css";
import { useAuthStore } from "./features/auth/store/authStore";
import { AuthPage } from "./features/auth/pages/AuthPage";
import { HomePage } from "./pages/HomePage";
import { ProfilesPage } from "./features/profiles/pages/ProfilesPage";
import { MemberProfilePage } from "./features/profiles/pages/MemberProfilePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LoadingScreen } from "./shared/components/LoadingScreen";

function App() {
  const user = useAuthStore((state) => state.user);
  // Pull required values from the auth store (checkAuth and isCheckingAuth)
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/auth"
          element={user ? <Navigate to="/home" replace /> : <AuthPage />}
        />

        <Route
          path="/home"
          element={user ? <HomePage /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/profiles"
          element={user ? <ProfilesPage /> : <Navigate to="/auth" replace />}
        />

        <Route
          path="/profiles/:slug"
          element={user ? <MemberProfilePage /> : <Navigate to="/auth" replace />}
        />

        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
