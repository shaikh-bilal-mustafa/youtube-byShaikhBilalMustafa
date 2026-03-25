import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import ProfilePage from "./pages/Profile";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <SignIn
              onSwitchToSignUp={() => navigate("/signup")}
              onSignIn={() => navigate("/")}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignUp
              onSwitchToSignIn={() => navigate("/login")}
              onSignUp={() => navigate("/")}
            />
          }
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
