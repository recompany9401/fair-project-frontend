import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BuyerHomePage.css";

function BuyerInfoPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [buyer, setBuyer] = useState({
    userId: "",
    name: "",
    phoneNumber: "",
    birthDate: "",
    gender: "M",
    householdCount: "",
  });

  const [dongHoInput, setDongHoInput] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchBuyerInfo();
  }, []);

  async function fetchBuyerInfo() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인 정보가 없습니다. 메인 페이지로 이동합니다.");
        navigate("/");
        return;
      }

      const res = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/buyers/me",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert("내 정보 조회 실패: " + data.message);
        navigate("/");
        return;
      }

      const combined = `${data.dong || ""}동 ${data.ho || ""}호`.trim();
      setDongHoInput(combined);

      setBuyer({
        userId: data.userId || "",
        name: data.name || "",
        phoneNumber: data.phoneNumber || "",
        birthDate: data.birthDate ? data.birthDate.substring(0, 10) : "",
        gender: data.gender || "M",
        householdCount: data.householdCount ? String(data.householdCount) : "",
      });

      setLoading(false);
    } catch (error) {
      console.error("내 정보 조회 오류:", error);
      alert("서버 오류");
      navigate("/");
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;

    if (name === "phoneNumber" || name === "householdCount") {
      const numeric = value.replace(/[^0-9]/g, "");
      setBuyer((prev) => ({ ...prev, [name]: numeric }));
      return;
    }

    if (name === "dongHo") {
      setDongHoInput(value);
      return;
    }

    setBuyer((prev) => ({ ...prev, [name]: value }));
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  }

  async function handleUpdate() {
    try {
      let parsedDong = "";
      let parsedHo = "";
      const regex = /^(\d+)동\s*(\d+)호$/;
      const match = dongHoInput.trim().match(regex);
      if (match) {
        parsedDong = match[1];
        parsedHo = match[2];
      } else {
        alert("동/호는 '123동 456호' 형태로 입력해주세요.");
        return;
      }

      if (newPassword || confirmPassword) {
        if (newPassword.length < 8) {
          alert("비밀번호는 8자리 이상이어야 합니다.");
          return;
        }
        if (newPassword !== confirmPassword) {
          alert("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
          return;
        }
      }

      const token = localStorage.getItem("token");
      if (!token) {
        alert("로그인 정보가 없습니다.");
        navigate("/");
        return;
      }

      const bodyData = {
        name: buyer.name,
        phoneNumber: buyer.phoneNumber,
        dong: parsedDong,
        ho: parsedHo,
        birthDate: buyer.birthDate || null,
        gender: buyer.gender,
        householdCount: parseInt(buyer.householdCount, 10) || 0,
      };

      if (newPassword) {
        bodyData.password = newPassword;
      }

      const res = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/buyers/me",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bodyData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setMessage("수정 실패: " + data.message);
        return;
      }

      alert("정보 수정 완료");
    } catch (error) {
      console.error("내 정보 수정 오류:", error);
      alert("서버 오류");
    }
  }

  if (loading) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="buyer-page buyer-info">
      <div className="top-banner">
        <img src="/images/logo-white.png" alt="logo" />
      </div>

      <form>
        <div>
          <label>아이디</label>
          <input type="text" name="userId" value={buyer.userId} readOnly />
        </div>

        <div>
          <label>계약자명</label>
          <input
            type="text"
            name="name"
            value={buyer.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>연락처</label>
          <input
            type="text"
            name="phoneNumber"
            value={buyer.phoneNumber}
            onChange={handleChange}
            placeholder="숫자만 입력"
          />
        </div>

        <div>
          <label>동/호</label>
          <input
            type="text"
            name="dongHo"
            value={dongHoInput}
            onChange={handleChange}
            placeholder="예: 101동 202호"
          />
        </div>

        <div>
          <label>생년월일</label>
          <input
            type="date"
            name="birthDate"
            value={buyer.birthDate}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>성별</label>
          <select name="gender" value={buyer.gender} onChange={handleChange}>
            <option value="M">남성</option>
            <option value="F">여성</option>
            <option value="OTHER">기타</option>
          </select>
        </div>

        <div>
          <label>세대원수</label>
          <input
            type="text"
            name="householdCount"
            value={buyer.householdCount}
            onChange={handleChange}
            placeholder="숫자만 입력"
          />
        </div>

        <div>
          <label>새 비밀번호</label>
          <input
            type="password"
            name="newPassword"
            value={newPassword}
            onChange={handlePasswordChange}
            placeholder="8자리 이상"
          />
        </div>
        <div>
          <label>비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handlePasswordChange}
          />
        </div>

        <button onClick={handleUpdate} type="button">
          저장
        </button>
      </form>
    </div>
  );
}

export default BuyerInfoPage;
