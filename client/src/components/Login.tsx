import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";
import "./Responsive.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu!");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8080/users?email=${email}`);

      if (res.data.length === 0) {
        setError("Email chưa được đăng ký!");
        return;
      }

      const user = res.data[0];

      if (user.password !== password) {
        setError("Mật khẩu không chính xác!");
        return;
      }

      setError("");

      if (remember) {
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/manager");
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Không thể kết nối đến server!");
    }
  };

  return (
    <div className="container">
      <h1 className="left-align">Đăng nhập</h1>
      <p className="left-align subtitle">
        Đăng nhập tài khoản để sử dụng hệ thống quản lý.
      </p>

      <input
        type="email"
        id="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        id="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="checkbox-container">
        <div className="remember-me">
          <input
            type="checkbox"
            id="remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <label htmlFor="remember">Nhớ tài khoản</label>
        </div>
        <div className="forgot-password-container">
          <a href="#" className="forgot-password">
            Quên mật khẩu?
          </a>
        </div>
      </div>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="error-message">{error}</p>}

      <button id="loginBtn" onClick={handleLogin}>
        Đăng nhập
      </button>

      <p className="left-align">
        Bạn chưa có tài khoản? <a href="/register">Đăng ký</a>
      </p>
    </div>
  );
}
