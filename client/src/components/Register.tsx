import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./register.css";
import "./Responsive.css";

export default function Register() {
  const navigate = useNavigate();

  const [lastname, setLastname] = useState("");
  const [firstname, setFirstname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);

  const [errors, setErrors] = useState({
    lastname: "",
    firstname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validate = () => {
    let newErrors: any = {};

    if (!lastname.trim()) newErrors.lastname = "Vui lòng nhập họ và tên đệm";
    if (!firstname.trim()) newErrors.firstname = "Vui lòng nhập tên";
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      newErrors.email = "Email không hợp lệ";

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu tối thiểu 8 ký tự";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không được để trống";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không trùng khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && terms;
  };

  const handleSubmit = async () => {
    if (!terms) {
      alert("Vui lòng xác nhận đồng ý với chính sách và điều khoản!");
      return;
    }

    if (validate()) {
      try {
        //  Kiểm tra email đã tồn tại chưa
        const res = await axios.get(
          `http://localhost:8080/users?email=${email}`
        );
        if (res.data.length > 0) {
          alert("Email này đã được đăng ký. Vui lòng dùng email khác!");
          return;
        }

        //  Gửi request POST để thêm user mới
        await axios.post("http://localhost:8080/users", {
          id: Date.now(),
          lastname,
          firstname,
          email,
          password,
        });

        alert("Đăng ký thành công!");
        navigate("/login");
      } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        alert("Đăng ký thất bại. Vui lòng thử lại sau.");
      }
    }
  };

  return (
    <div className="register-page">
      <div className="custom-container">
        <h1>Đăng ký tài khoản</h1>
        <p className="left-align subtitle">
          Đăng ký tài khoản để sử dụng dịch vụ.
        </p>

        <div className="name-fields">
          <div className="input-group">
            <input
              type="text"
              placeholder="Họ và tên đệm"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className={errors.lastname ? "input-error" : ""}
            />
            <div className="error-message">{errors.lastname}</div>
          </div>
          <div className="input-group">
            <input
              type="text"
              placeholder="Tên"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className={errors.firstname ? "input-error" : ""}
            />
            <div className="error-message">{errors.firstname}</div>
          </div>
        </div>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "input-error" : ""}
          />
          <div className="error-message">{errors.email}</div>
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "input-error" : ""}
          />
          <div className="error-message">{errors.password}</div>
        </div>

        <div className="input-group">
          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? "input-error" : ""}
          />
          <div className="error-message">{errors.confirmPassword}</div>
        </div>

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="terms"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
          />
          <label htmlFor="terms">
            Tôi đồng ý với <a href="#">chính sách và điều khoản</a>
          </label>
        </div>

        <button disabled={!terms} onClick={handleSubmit}>
          Đăng ký
        </button>

        <p>
          Đã có tài khoản? <a href="/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  );
}
