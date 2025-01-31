import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { FaUser, FaLock } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/user/login",
        formData
      );
      login(res.data);
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-8 rounded-lg bg-gray-800 shadow-lg w-96 text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-gray-700 p-2 rounded">
            <FaUser className="text-gray-400" />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="bg-transparent outline-none w-full ml-2 text-white"
            />
          </div>
          <div className="flex items-center bg-gray-700 p-2 rounded">
            <FaLock className="text-gray-400" />
            <input
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              className="bg-transparent outline-none w-full ml-2 text-white"
            />
          </div>
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
            Login
          </button>
          <p className="text-center">
            Don't have Account ?{" "}
            <a href="/signup" className="text-gray-200">
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
