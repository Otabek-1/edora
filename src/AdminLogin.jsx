import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { login } from "./api";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await login(username, password);
      // Agar token qaytsa, uni localStorage ga saqlash mumkin
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        navigate("/dashboard");
      } else {
        setError("Login yoki parol noto'g'ri.");
      }
    } catch (err) {
      setError("Login yoki parol noto'g'ri.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
            Admin Panelga Kirish
          </h2>
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center">{error}</div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Login</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Parol</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            disabled={loading}
          >
            {loading ? "Kirilmoqda..." : "Kirish"}
          </button>
        </form>
      </main>
      <Footer />
    </div>
  );
}