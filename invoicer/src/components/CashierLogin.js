import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CashierLogin = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // React Router navigation hook

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!data.email || !data.password) {
      setError("Email and Password are required.");
      return;
    }

    try {
      const url = "http://localhost:8080/api/auth"; // Backend login API endpoint
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("token", res.token); // Store the token in local storage
      navigate("/invoice"); // Navigate to the Dashboard after successful login
      
    } catch (error) {
      if (error.response && error.response.status >= 400 && error.response.status <= 500) {
        setError(error.response.data.message || "Invalid credentials");
      } else {
        setError("Server is not responding. Please try again later.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
         Cashier's Login 
        </h1>
        <form onSubmit={handleSubmit} className=""> {/* Reduced gap here */}
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange}
            value={data.email}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={handleChange}
            value={data.password}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && <div className="text-red-500 text-sm text-center">{error}</div>}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-200"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup">
            <span className="text-blue-500 font-semibold hover:underline">
              Sign Up
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CashierLogin;
