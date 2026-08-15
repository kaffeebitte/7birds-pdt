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
import { NotFoundPage } from "./pages/NotFoundPage";

function App() {
  const user = useAuthStore((state) => state.user);
  // rút 2 giá trị cần thiết từ zustand store (checkAuth và isCheckingAuth)
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
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

        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
