import React, { useState } from "react";
import { api, setAccessToken } from "../api/apiInstance";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProfileThunk } from "../store/authSlice";

export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", formData);
      console.log("LOGIN RESPONSE:", response.data);
      console.log("ACCESS TOKEN:", response.data.accessToken);

      setAccessToken(response.data.accessToken);
      await dispatch(fetchProfileThunk()).unwrap()
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
    <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 text-white shadow-2xl">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Login</h1>

      {error && <p className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="email"
          placeholder="Email"
          className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          name="password"
          placeholder="Password"
          className="w-full rounded-xl border border-gray-700 bg-gray-950 px-4 py-3 text-gray-200 outline-none transition placeholder:text-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading} className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <button onClick={() => navigate("/register")} className="mt-6 w-full text-center text-sm text-gray-400 transition hover:text-indigo-400">
        Don't have an account? Register
      </button>
    </div>
    </div>
  );
};
