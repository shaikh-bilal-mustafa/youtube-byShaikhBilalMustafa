import {Link } from "react-router-dom";

export default function SignUp(){
  
    return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-[#2b463c] via-[#b1d182] to-white text-[#333] shadow-sm">
      <div className="bg-white rounded-lg shadow-md w-full max-w-120 p-4 ">
        <div className="p-4"> 
        <form action="http://localhost:8000/api/v1/users/register" method="POST" className="">
         <h2 className="text-center font-bold mb-3 text-3xl">Sign Up</h2>
         
        <input type="text" name="username" placeholder="Name" className="w-full mb-4 px-3 py-2  text-[#333] border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" required />
        <input type="email" name="email" required placeholder="Email" className="w-full mb-4 px-3 py-2  text-[#333] border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
        <input type="password" name="password" required  placeholder="Password" className="w-full mb-4 px-3 py-2  text-[#333] border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
        <input type="password" placeholder="Confirm Password" className="w-full mb-4 px-3 py-2  text-[#333] border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
        <input type="text" name="mobileNumber" className="" placeholder="mobilenumber" />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 cursor-pointer">Sign Up</button>
        </form>
        
        <p className="text-center m-1 font text-l">Already have an account? <Link to="/login" className="text-blue-500 text-center hover:underline bg-center pl-5">Login</Link></p>
    </div>
    </div>
 </div>
)  
}