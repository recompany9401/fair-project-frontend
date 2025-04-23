// src/components/BusinessRegisterForm.js
import React, { useState } from "react";

function BusinessRegisterForm() {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    name: "", // 상호명
    businessNumber: "",
    representativeName: "",
    address: "",
    businessType: "",
    businessCategory: "",
    managerName: "",
    phoneNumber: "",
  });

  const [message, setMessage] = useState("");

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("회원가입 진행 중...");

    try {
      // 사업자 회원가입 API로 전송
      const response = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/businesses/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("사업자 회원가입 성공!");
        // 가입 성공 후 폼 초기화 or 다른 페이지로 이동
        setFormData({
          userId: "",
          password: "",
          name: "",
          businessNumber: "",
          representativeName: "",
          address: "",
          businessType: "",
          businessCategory: "",
          managerName: "",
          phoneNumber: "",
        });
      } else {
        setMessage(`오류: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>사업자 회원가입</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>아이디 (userId)</label>
        <input
          type="text"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          required
        />

        <label>비밀번호 (password)</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>상호명 (name)</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>사업자번호 (businessNumber)</label>
        <input
          type="text"
          name="businessNumber"
          value={formData.businessNumber}
          onChange={handleChange}
          required
        />

        <label>대표자명 (representativeName)</label>
        <input
          type="text"
          name="representativeName"
          value={formData.representativeName}
          onChange={handleChange}
          required
        />

        <label>주소 (address)</label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />

        <label>업태 (businessType)</label>
        <input
          type="text"
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
        />

        <label>종목 (businessCategory)</label>
        <input
          type="text"
          name="businessCategory"
          value={formData.businessCategory}
          onChange={handleChange}
        />

        <label>담당자명 (managerName)</label>
        <input
          type="text"
          name="managerName"
          value={formData.managerName}
          onChange={handleChange}
        />

        <label>연락처 (phoneNumber)</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <button type="submit" style={styles.submitButton}>
          회원가입
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

// 간단한 인라인 스타일 (원하는 CSS 방식으로 바꾸셔도 됩니다)
const styles = {
  container: {
    width: "400px",
    margin: "30px auto",
    textAlign: "left",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  submitButton: {
    marginTop: "12px",
    padding: "10px",
    backgroundColor: "#1976D2",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default BusinessRegisterForm;
