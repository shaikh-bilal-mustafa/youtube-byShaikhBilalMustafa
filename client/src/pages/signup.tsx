import {Link } from "react-router-dom";
import { useState } from "react";
export default function SignUp(){
  const [username,setUserName] = useState<string>("")
  const [email,setEmail] = useState<string>("")
  const [password,setPassword] = useState<string>("")
  const [mobileNumber,setMobileNumber] = useState<string>("")
  const [loading,setLoading] = useState<boolean>(false)
  const [message, setMessage] = useState<string>("")
  
   const handleSubmit= async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setLoading(true);
  try {
   
    const res = await fetch("http://localhost:8000/api/v1/users/register", {
    method: "POST",
    headers: {  
      "Content-Type": "application/json",
    },
    body: JSON.stringify({username,email,password,mobileNumber}),
  });
  const data = await res.json()
  console.log(data) 
  if(res.ok){
    setMessage(data.message || "Registration successfull")
   
  }else{
    setMessage(data.Error || "Registration failed")
  }
  } catch (error:any) {
    setMessage(error.message || "Something went wrong");
  } finally{
    setLoading(false)
  }
   
}
    return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-[#2b463c] via-[#b1d182] to-white text-[#333] shadow-sm">
      <div className="bg-white rounded-lg shadow-md w-full max-w-120 p-4 ">
        <div className="p-4"> 
        <form  onSubmit={handleSubmit} className="">
         <h2 className="text-center font-bold mb-3 text-3xl">Sign Up</h2>
         
        <input 
        type="text" 
        value={username} 
        onChange={(e)=>{setUserName(e.target.value)}} 
        name="username" 
        placeholder="Name" 
        className="w-full mb-4 px-3 py-2  text-[#333] border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" required />
        <input 
        type="email" 
        name="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} required 
        placeholder="Email" 
        className="w-full mb-4 px-3 py-2  text-[#333] border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
        <input 
        type="password" 
        name="password" 
        required 
        value={password}  
        onChange={(e)=>{setPassword(e.target.value)}}  
        placeholder="Password" 
        className="w-full mb-4 px-3 py-2  text-[#333] border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
        <input 
        type="password" 
        placeholder="Confirm Password"  
        className="w-full mb-4 px-3 py-2  text-[#333] border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
        <input type="text"
         name="mobileNumber" 
         value={mobileNumber} 
         onChange={(e)=>{setMobileNumber(e.target.value)}} 
         className="w-full mb-4 px-3 py-2  text-[#333] border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" placeholder="mobilenumber" />
        <button 
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer" 
        type="submit" 
        disabled={loading}
        >
          {loading? "Submitting..." : "Sign Up"}
          </button>
         {message && <p className="text-center mt-2 text-green-500">{message}</p>}
        </form>
        
        <p className="text-center m-1 font text-l">Already have an account? <Link to="/login" className="text-blue-500 text-center hover:underline bg-center pl-5">Login</Link></p>
        <Link to="/" className="text-blue-500 text-center pl-48 hover:underline bg-center ">Go to home</Link>
    </div>
    </div>
 </div>
)  
}