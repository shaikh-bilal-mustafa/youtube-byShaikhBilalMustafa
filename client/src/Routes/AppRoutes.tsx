import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages (create these components)
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/SignUp";
// import Profile from "../pages/profile";
import NotFound from "../pages/NotFound";

// Example type for user (adjust as needed)
interface User {
  id: string;
  username: string;
  email: string;
}

// Props for AppRoutes
interface AppRoutesProps {
  user: User | null;
  onLogout: () => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({ user, onLogout }) => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" />}
        />

        {/* Protected Route */}
        {/* <Route
          path="/profile"
          element={
            user ? (
              <Profile user={user} onLogout={onLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        /> */}

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;