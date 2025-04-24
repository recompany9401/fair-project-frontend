import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, password }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        if (data.role === "BUYER") {
          localStorage.setItem("buyerId", data.userId);
          navigate("/buyer-home");
        } else if (data.role === "BUSINESS") {
          localStorage.setItem("businessId", data.userId);
          if (data.businessName) {
            localStorage.setItem("businessName", data.businessName);
          }
          navigate("/business-home");
        } else if (data.role === "ADMIN") {
          localStorage.setItem("adminId", data.userId);
          navigate("/admin");
        } else {
          alert("로그인 실패: 알 수 없는 사용자 타입");
        }
      } else {
        alert(`${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="login-container">
      <img src="/images/logo.png" alt="로고" />
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
          placeholder="아이디"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="비밀번호"
        />

        <button type="submit">로그인</button>
      </form>

      {message && <p>{message}</p>}

      <div className="join-btn">
        <Link to="/register/business">사업자 회원가입</Link>
        <Link to="/register/buyer">입주자 회원가입</Link>
      </div>
    </div>
  );
}

export default LoginPage;
