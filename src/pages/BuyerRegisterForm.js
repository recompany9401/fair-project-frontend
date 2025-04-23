// src/components/BuyerRegisterForm.js
import React, { useState } from "react";

function BuyerRegisterForm() {
  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    name: "", // 계약자명
    phoneNumber: "",
    dong: "",
    ho: "",
    birthDate: "",
    gender: "M", // 기본값 (선택)
    householdCount: "",
    personalInfoAgreement: false,
  });

  const [message, setMessage] = useState("");

  // 입력값 변경 처리
  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      // 체크박스의 경우
      setFormData((prev) => ({
        ...prev,
        [name]: e.target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // 폼 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("회원가입 진행 중...");

    try {
      // 구매자 회원가입 API
      const response = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/buyers/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            // householdCount가 문자열일 수 있으니 숫자로 변환
            householdCount: formData.householdCount
              ? parseInt(formData.householdCount, 10)
              : 0,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage("입주자 회원가입 성공!");
        // 가입 성공 후 폼 초기화
        setFormData({
          userId: "",
          password: "",
          name: "",
          phoneNumber: "",
          dong: "",
          ho: "",
          birthDate: "",
          gender: "M",
          householdCount: "",
          personalInfoAgreement: false,
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
      <h2>입주자 회원가입</h2>
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

        <label>계약자명 (name)</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>연락처 (phoneNumber)</label>
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />

        <label>동 (dong)</label>
        <input
          type="text"
          name="dong"
          value={formData.dong}
          onChange={handleChange}
          required
        />

        <label>호 (ho)</label>
        <input
          type="text"
          name="ho"
          value={formData.ho}
          onChange={handleChange}
          required
        />

        <label>생년월일 (birthDate)</label>
        <input
          type="date"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
        />

        <label>성별 (gender)</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="M">남성</option>
          <option value="F">여성</option>
          <option value="OTHER">기타</option>
        </select>

        <label>세대원수 (householdCount)</label>
        <input
          type="number"
          name="householdCount"
          value={formData.householdCount}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="personalInfoAgreement"
            checked={formData.personalInfoAgreement}
            onChange={handleChange}
          />
          개인정보 이용 동의
        </label>

        <button type="submit" style={styles.submitButton}>
          회원가입
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

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
    backgroundColor: "#00796B",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default BuyerRegisterForm;
