import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegisterForm.css";

function BusinessRegisterForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    userId: "",
    password: "",
    confirmPassword: "",
    name: "",
    businessNumber: "",
    representativeName: "",
    address: "",
    businessType: "",
    businessCategory: "",
    managerName: "",
    phoneNumber: "",
  });

  const [message, setMessage] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const [isDuplicate, setIsDuplicate] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let sanitizedValue = value;
    if (name === "businessNumber" || name === "phoneNumber") {
      sanitizedValue = value.replace(/[^0-9]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };

  const handleCheckUserId = async () => {
    if (!formData.userId) {
      alert("아이디를 입력하세요.");
      return;
    }

    try {
      setIsChecking(true);
      const response = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/auth/check-userid?userId=${formData.userId}`
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

  const validateForm = () => {
    const { userId, password, confirmPassword, businessNumber, phoneNumber } =
      formData;

    const idRegex = /^[a-zA-Z0-9]{8,}$/;
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;

    if (!idRegex.test(userId)) {
      alert("아이디는 영문 8자리 이상이어야 합니다.");
      return false;
    }

    if (!pwRegex.test(password)) {
      alert("비밀번호는 영문+숫자 조합의 8자리 이상이어야 합니다.");
      return false;
    }

    if (password !== confirmPassword) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return false;
    }

    if (!/^\d+$/.test(businessNumber)) {
      alert("사업자번호는 숫자만 입력해야 합니다.");
      return false;
    }

    if (!/^\d+$/.test(phoneNumber)) {
      alert("연락처는 숫자만 입력해야 합니다.");
      return false;
    }

    if (isDuplicate) {
      alert("이미 존재하는 아이디입니다. 다른 아이디를 사용해주세요.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const { confirmPassword, ...submitData } = formData;

    try {
      const response = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/businesses/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submitData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("회원가입이 완료되었습니다.");

        setFormData({
          userId: "",
          password: "",
          confirmPassword: "",
          name: "",
          businessNumber: "",
          representativeName: "",
          address: "",
          businessType: "",
          businessCategory: "",
          managerName: "",
          phoneNumber: "",
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

  return (
    <div className="register-container business-theme">
      <h2>사업자 회원가입</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="id-check-container">
          <input
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            placeholder="아이디"
            required
          />
          <button
            type="button"
            onClick={handleCheckUserId}
            className="id-check"
          >
            아이디 중복 확인
          </button>
        </div>

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="비밀번호"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="비밀번호 확인"
          required
        />

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="상호명"
          required
        />

        <input
          type="text"
          name="businessNumber"
          value={formData.businessNumber}
          onChange={handleChange}
          placeholder="사업자번호 ('-'를 제외한 숫자 10자리)"
          required
        />

        <input
          type="text"
          name="representativeName"
          value={formData.representativeName}
          onChange={handleChange}
          placeholder="대표자명"
          required
        />

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="주소"
          required
        />

        <input
          type="text"
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
          placeholder="업태"
          required
        />

        <input
          type="text"
          name="businessCategory"
          value={formData.businessCategory}
          onChange={handleChange}
          placeholder="종목"
          required
        />

        <input
          type="text"
          name="managerName"
          value={formData.managerName}
          onChange={handleChange}
          placeholder="담당자명"
          required
        />

        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="연락처 ('-'를 제외한 숫자 11자리)"
          required
        />

        <button type="submit">회원가입</button>
      </form>

      {message && <p className="register-footer">{message}</p>}
    </div>
  );
}

export default BusinessRegisterForm;
