import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Home from './pages/Home'
// import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import { Routes, Route, useNavigate } from "react-router-dom";
import './App.css'
function App() {
  const navigate = useNavigate();
 
  return (
    <>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<SignIn onSwitchToSignUp={() => navigate('/signup')} onSignIn={() => navigate('/')} />} />
      <Route path="/signup" element={<SignUp onSwitchToSignIn={() => navigate('/login')} onSignUp={() => navigate('/')} />} />
      {/* <Route path="/profile" element={<Profile onLogout={() => navigate('/login')} />} /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}

export default App
