import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/api/login",
        { email, password },
        { withCredentials: true }
      );

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  }

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center 
                    bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h2>

        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       text-black placeholder-gray-400"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       text-black placeholder-gray-400"
          />
          <button className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition">
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500 text-center">
          Demo admin: <span className="font-mono">admin@example.com</span> /{" "}
          <span className="font-mono">password</span>
        </p>
        <p className="mt-6 text-sm text-gray-500 text-center">
          Don't have an account? <span className="font-medium text-green-600 cursor-pointer" onClick={()=>navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  );
}
