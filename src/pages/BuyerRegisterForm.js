import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterForm.css";

function BuyerRegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    name: "",
    phoneNumber: "",
    dong: "",
    ho: "",
    birthDate: "",
    gender: "M",
    householdCount: "",
    personalInfoAgreement: false,
  });

  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false);

  const numericRegex = /[^0-9]/g;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let sanitizedValue = value;

    const numericFields = [
      "userId",
      "phoneNumber",
      "dong",
      "ho",
      "householdCount",
    ];
    if (numericFields.includes(name)) {
      sanitizedValue = sanitizedValue.replace(numericRegex, "");
    }

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: e.target.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    }
  };

  const handleCheckUserId = async () => {
    const { userId } = formData;

    const idRegex = /^[0-9]{7}$/;
    if (!idRegex.test(userId)) {
      alert("아이디는 숫자 7자리만 가능합니다.");
      return;
    }

    try {
      setIsChecking(true);
      const response = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/auth/check-userid?userId=${userId}`
      );
      const data = await response.json();

      if (data.exists) {
        setIsDuplicate(true);
        alert("이미 존재하는 아이디입니다.");
      } else {
        setIsDuplicate(false);
        alert("사용 가능한 아이디입니다.");
      }
    } catch (error) {
      console.error("아이디 중복 확인 오류:", error);
      alert("중복 확인 중 오류가 발생했습니다.");
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!formData.personalInfoAgreement) {
      alert("개인정보이용에 동의하셔야 가입이 가능합니다.");
      return;
    }

    try {
      const response = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/buyers/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            householdCount: formData.householdCount
              ? parseInt(formData.householdCount, 10)
              : 0,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("회원가입이 완료됐습니다.");
        setFormData({
          userId: "",
          password: "",
          confirmPassword: "",
          name: "",
          phoneNumber: "",
          dong: "",
          ho: "",
          birthDate: "",
          gender: "M",
          householdCount: "",
          personalInfoAgreement: false,
        });
        setIsDuplicate(false);
        navigate("/");
      } else {
        alert(`오류: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const validateForm = () => {
    const {
      userId,
      password,
      confirmPassword,
      phoneNumber,
      dong,
      ho,
      householdCount,
    } = formData;

    const idRegex = /^[0-9]{7}$/;
    if (!idRegex.test(userId)) {
      alert("아이디는 숫자 7자리만 가능합니다.");
      return false;
    }

    const pwRegex = /^.{8,}$/;
    if (!pwRegex.test(password)) {
      alert("비밀번호는 8자리 이상이어야 합니다.");
      return false;
    }

    if (password !== confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return false;
    }

    if (isDuplicate) {
      alert("이미 존재하는 아이디입니다. 다른 아이디를 사용해주세요.");
      return false;
    }

    if (!phoneNumber) {
      alert("연락처를 입력하세요.");
      return false;
    }
    if (!dong) {
      alert("동을 입력하세요.");
      return false;
    }
    if (!ho) {
      alert("호를 입력하세요.");
      return false;
    }
    if (!householdCount) {
      alert("세대원수를 입력하세요.");
      return false;
    }

    return true;
  };

  return (
    <div className="register-container buyer-theme">
      <h2>입주자 회원가입</h2>

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="id-check-container">
          <input
            type="text"
            name="userId"
            placeholder="아이디 (숫자 동호수 7자리)"
            value={formData.userId}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={handleCheckUserId}
            disabled={isChecking}
            className="id-check"
          >
            아이디 중복 확인
          </button>
        </div>

        <input
          type="password"
          name="password"
          placeholder="비밀번호 (8자리 이상)"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          placeholder="계약자명"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phoneNumber"
          placeholder="연락처 ('-' 제외)"
          value={formData.phoneNumber}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="dong"
          placeholder="동"
          value={formData.dong}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="ho"
          placeholder="호"
          value={formData.ho}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="birthDate"
          placeholder="생년월일"
          value={formData.birthDate}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option value="M">남성</option>
          <option value="F">여성</option>
          <option value="OTHER">기타</option>
        </select>

        <input
          type="number"
          name="householdCount"
          placeholder="세대원수"
          value={formData.householdCount}
          onChange={handleChange}
          required
        />

        <div className="personalInfoAgreement">
          <input
            type="checkbox"
            name="personalInfoAgreement"
            checked={formData.personalInfoAgreement}
            onChange={handleChange}
          />
          <h3>개인정보 이용 동의</h3>
        </div>

        <button type="submit">회원가입</button>
      </form>

      {message && <p className="register-footer">{message}</p>}
    </div>
  );
}

export default BuyerRegisterForm;
