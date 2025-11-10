import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Login: React.FC = () => {
  const { signInWithTeacherCredentials } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format");
      return;
    }

    try {
      setLoading(true);
      await signInWithTeacherCredentials(email.trim(), password);
      setSuccess("🎉 Login successful!");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      console.error("Login error:", err);

      // Handle specific errors
      if (err.message === "Invalid email or password") {
        setError(
          "❌ Invalid email or password. Please contact admin if you need account access."
        );
      } else if (err.message === "Failed to fetch teachers data") {
        setError("❌ Unable to connect to server. Please try again later.");
      } else if (err.message === "No teachers found") {
        setError("❌ No teacher accounts found. Please contact admin.");
      } else {
        setError(err.message || "❌ Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-100 p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8">
          <img
            src="/logo.jpg"
            alt="Trí Tuệ 8+ Logo"
            className="mx-auto mb-4 w-36 h-36"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-[#86c7cc] mb-2">
            Trí Tuệ 8+
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Schedule Management System
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-[#86c7cc]">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2">
            Teacher Login
          </h2>
          <p className="text-center text-sm text-gray-600 mb-4 sm:mb-6">
            Enter your account details provided by admin
          </p>

          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 sm:p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Login/Register Form */}
          {/* Email/Password Form */}
          <form onSubmit={handleEmailPasswordSubmit} className="mb-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="email@example.com"
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#86c7cc] focus:border-[#86c7cc] outline-none"
                  disabled={loading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="••••••••"
                  className="w-full p-2.5 sm:p-3 text-sm sm:text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#86c7cc] focus:border-[#86c7cc] outline-none"
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: "#86c7cc",
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  fontSize: "16px",
                  padding: "12px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Logging in..." : "LOGIN"}
              </button>
            </div>

            {/* Info text */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account? Contact your admin to get access.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-6 sm:mt-8 text-center text-gray-500 text-xs sm:text-sm">
          © 2025 Trí Tuệ 8+. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
