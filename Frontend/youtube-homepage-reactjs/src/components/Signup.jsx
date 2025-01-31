import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock, FaEnvelope, FaPhone, FaImage } from "react-icons/fa";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    channelName: "",
    email: "",
    phone: "",
    password: "",
    logo: null,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (
      !formData.channelName ||
      !formData.email ||
      !formData.password ||
      !formData.phone ||
      !formData.logo
    ) {
      setError("All fields are required!");
      setLoading(false);
      return;
    }

    const formDataObj = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      formDataObj.append(key, value)
    );

    try {
      const res = await axios.post(
        "http://localhost:3000/user/signup",
        formDataObj,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="p-8 rounded-lg bg-gray-800 shadow-lg w-96 text-white">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Create an Account
        </h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center bg-gray-700 p-2 rounded">
            <FaUser className="text-gray-400" />
            <input
              type="text"
              name="channelName"
              onChange={handleChange}
              placeholder="Channel Name"
              className="bg-transparent outline-none w-full ml-2 text-white"
            />
          </div>
          <div className="flex items-center bg-gray-700 p-2 rounded">
            <FaEnvelope className="text-gray-400" />
            <input
              type="email"
              name="email"
              onChange={handleChange}
              placeholder="Email"
              className="bg-transparent outline-none w-full ml-2 text-white"
            />
          </div>
          <div className="flex items-center bg-gray-700 p-2 rounded">
            <FaPhone className="text-gray-400" />
            <input
              type="text"
              name="phone"
              onChange={handleChange}
              placeholder="Phone Number"
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
          <div className="flex items-center bg-gray-700 p-2 rounded">
            <FaImage className="text-gray-400" />
            <input
              type="file"
              name="logo"
              onChange={handleChange}
              className="bg-transparent outline-none w-full ml-2 text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded flex justify-center items-center"
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
