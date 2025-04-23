// src/pages/LoginPage.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("로그인 중...");

    try {
      // userId, password 로 /api/login 에 POST
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, password }),
      });
      const data = await response.json();

      if (response.ok) {
        // 로그인 성공 응답
        if (data.role === "BUYER") {
          // 구매자
          localStorage.setItem("buyerId", data.userId);
          navigate("/buyer-home");
        } else if (data.role === "BUSINESS") {
          // 사업자
          localStorage.setItem("businessId", data.userId);
          if (data.businessName) {
            localStorage.setItem("businessName", data.businessName);
          }
          navigate("/business-home");
        } else if (data.role === "ADMIN") {
          // ★ 관리자
          // 필요하다면 adminId, token 등 저장
          localStorage.setItem("adminId", data.userId);
          // 관리자 페이지로 이동
          navigate("/admin");
        } else {
          // role이 정의되지 않은 경우
          setMessage("로그인 실패: 알 수 없는 사용자 타입");
        }
      } else {
        // 로그인 실패 (아이디 없음, 비번 틀림, 미승인 등)
        setMessage(`로그인 실패: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>로그인</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <label>아이디</label>
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        />

        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" style={styles.button}>
          로그인
        </button>
      </form>

      {message && <p>{message}</p>}

      <div style={{ marginTop: "20px" }}>
        <p>회원가입이 필요하신가요?</p>
        <Link to="/register/business" style={styles.link}>
          사업자 회원가입
        </Link>
        <Link to="/register/buyer" style={styles.link}>
          입주자 회원가입
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "300px",
    margin: "50px auto",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  button: {
    padding: "8px",
    backgroundColor: "#1976D2",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
  },
  link: {
    display: "inline-block",
    margin: "0 10px",
    color: "#1976D2",
    textDecoration: "none",
  },
};

export default LoginPage;
