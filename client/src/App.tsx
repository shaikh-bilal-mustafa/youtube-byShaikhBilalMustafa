import React from "react";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

declare global {
  interface Window {
    __analyticsInitialized?: boolean;
  }
}
import UploadPage from "./pages/UploadVideo";
import Pay  from "./pages/hadiya"
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import ProfilePage from "./pages/Profile";

function App() {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Placeholder for analytics initialization (Google Analytics, Plausible, etc.)
    if (window && !window.__analyticsInitialized) {
      console.log("Analytics placeholder: initialize here");
      window.__analyticsInitialized = true;
    }
  }, []);

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
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/pay" element={<Pay />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
