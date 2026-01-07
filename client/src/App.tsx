import SignUp from './pages/signup'
import Login from './pages/login'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { Routes, Route } from "react-router-dom";
import './App.css'
function App() {
 

  return (
    <>
      <h1>Welcome to youtube</h1>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}

export default App
