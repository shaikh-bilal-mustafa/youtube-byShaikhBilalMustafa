import {Link } from "react-router-dom";
export default function Home() {    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-200">
            <h1 className="text-2xl font-bold">Welcome to YouTube</h1>
            <Link to="/login" className="mt-4 inline-block bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300">Login</Link>
            <Link to="/signup" className="mt-4 inline-block bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300">Sign Up</Link>
        </div>
    );
}