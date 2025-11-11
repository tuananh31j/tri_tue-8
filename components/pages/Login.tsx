import { useAuth } from "@/contexts/AuthContext";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Alert, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Login: React.FC = () => {
  const { signInWithTeacherCredentials } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleEmailPasswordSubmit = async (values: any) => {
    setError("");
    setSuccess("");

    const { email, password } = values;

    try {
      setLoading(true);
      await signInWithTeacherCredentials(email.trim(), password);
      setSuccess("🎉 Login successful!");
      navigate("/workspace");
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8">
          <img
            src="/img/logo.png"
            alt="Trí Tuệ 8+ Logo"
            className="mx-auto mb-4 w-36 h-36"
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-[#36797f] mb-2">
            Trí Tuệ 8+
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Hệ thống quản lý lịch trình
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 border-2 border-[#36797f]">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-2">
            Đăng nhập giáo viên
          </h2>
          <p className="text-center text-sm text-gray-600 mb-4 sm:mb-6">
            Nhập thông tin tài khoản của bạn được cung cấp bởi quản trị viên
          </p>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              onClose={() => setError("")}
              className="mb-4"
            />
          )}

          {success && (
            <Alert
              message={success}
              type="success"
              showIcon
              closable
              onClose={() => setSuccess("")}
              className="mb-4"
            />
          )}

          {/* Login/Register Form */}
          {/* Email/Password Form */}
          <Form
            onFinish={handleEmailPasswordSubmit}
            layout="vertical"
            className="mb-4"
          >
            <Form.Item
              label={
                <span className="text-sm font-semibold text-gray-700">
                  Email
                </span>
              }
              name="email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="email@example.com"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              label={
                <span className="text-sm font-semibold text-gray-700">
                  Mật khẩu
                </span>
              }
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="••••••••"
                size="large"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={loading}
                style={{
                  backgroundColor: "#36797f",
                  borderColor: "#36797f",
                  fontWeight: "bold",
                  fontSize: "16px",
                  height: "48px",
                }}
              >
                {loading ? "Logging in..." : "LOGIN"}
              </Button>
            </Form.Item>

            {/* Info text */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Bạn chưa có tài khoản? Liên hệ quản trị viên để được cấp quyền
                truy cập.
              </p>
            </div>
          </Form>
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
