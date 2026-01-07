import { Link } from "react-router-dom";

export default function Login() {   
    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-[#2b463c] via-[#b1d182] to-white text-[#333] shadow-sm ">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                <form>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">Password</label>
                        <input type="password" id="password" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500" />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Login</button>
                </form>
                <p className="text-center m-1 font text-l">Don't have an account?<Link to="/signup" className="text-blue-500 text-center hover:underline bg-center pl-5">Sign Up</Link></p>
            </div>
        </div>
    );
}