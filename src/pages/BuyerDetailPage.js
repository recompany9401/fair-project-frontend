import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AdminDetailPage.css";

function BuyerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetchBuyerDetail();
  }, []);

  const fetchBuyerDetail = async () => {
    try {
      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/admin/buyers/${id}`
      );
      if (!res.ok) {
        const errData = await res.json();
        console.error("입주자 상세 조회 실패:", errData.message);
        return;
      }
      const data = await res.json();
      setBuyer(data);
      setLoading(false);
    } catch (err) {
      console.error("입주자 상세 조회 오류:", err);
    }
  };

  const handleChange = (field, value) => {
    setBuyer((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    if (field === "newPassword") setNewPassword(value);
    if (field === "confirmPassword") setConfirmPassword(value);
  };

  const handleSave = async () => {
    try {
      if (newPassword || confirmPassword) {
        if (newPassword.length < 8) {
          alert("비밀번호는 8자리 이상이어야 합니다.");
          return;
        }
        if (newPassword !== confirmPassword) {
          alert("새 비밀번호와 확인이 일치하지 않습니다.");
          return;
        }
      }

      const updateData = {
        name: buyer.name,
        phoneNumber: buyer.phoneNumber,
        dong: buyer.dong,
        ho: buyer.ho,
        birthDate: buyer.birthDate || null,
        gender: buyer.gender,
        householdCount: buyer.householdCount || 0,
      };

      if (newPassword) {
        updateData.password = newPassword;
      }

      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/admin/buyers/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        alert("수정 실패: " + data.message);
        return;
      }

      alert("수정 완료");
      setNewPassword("");
      setConfirmPassword("");
      fetchBuyerDetail();
    } catch (err) {
      console.error("수정 오류:", err);
      alert("서버 오류");
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.substring(0, 10);
  };

  if (loading || !buyer) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="admin-detail">
      <div className="detail-header">
        <img src="/images/logo-white.png" alt="logo" />
        <h2>입주자 상세 정보</h2>
      </div>

      <div className="detail-card">
        <ul>
          <li>
            <strong>아이디</strong>
            <input type="text" value={buyer.userId} readOnly></input>
          </li>
          <li>
            <strong>계약자명</strong>
            <input
              type="text"
              value={buyer.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </li>
          <li>
            <strong>전화번호</strong>
            <input
              type="text"
              value={buyer.phoneNumber || ""}
              onChange={(e) =>
                handleChange(
                  "phoneNumber",
                  e.target.value.replace(/[^0-9]/g, "")
                )
              }
            />
          </li>
          <li>
            <strong>동</strong>
            <input
              type="text"
              value={buyer.dong || ""}
              onChange={(e) =>
                handleChange("dong", e.target.value.replace(/[^0-9]/g, ""))
              }
            />
          </li>
          <li>
            <strong>호</strong>
            <input
              type="text"
              value={buyer.ho || ""}
              onChange={(e) =>
                handleChange("ho", e.target.value.replace(/[^0-9]/g, ""))
              }
            />
          </li>
          <li>
            <strong>생년월일</strong>
            <input
              type="date"
              value={formatDate(buyer.birthDate)}
              onChange={(e) => handleChange("birthDate", e.target.value)}
            />
          </li>
          <li>
            <strong>성별</strong>
            <select
              value={buyer.gender || "M"}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="M">남성</option>
              <option value="F">여성</option>
              <option value="OTHER">기타</option>
            </select>
          </li>
          <li>
            <strong>세대원수</strong>
            <input
              type="text"
              value={buyer.householdCount || ""}
              onChange={(e) =>
                handleChange(
                  "householdCount",
                  e.target.value.replace(/[^0-9]/g, "")
                )
              }
            />
          </li>

          <li>
            <strong>새 비밀번호</strong>
            <input
              type="password"
              value={newPassword}
              onChange={(e) =>
                handlePasswordChange("newPassword", e.target.value)
              }
            />
          </li>
          <li>
            <strong>비밀번호 확인</strong>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                handlePasswordChange("confirmPassword", e.target.value)
              }
            />
          </li>
        </ul>
      </div>

      <button onClick={handleSave}>저장</button>
    </div>
  );
}

export default BuyerDetailPage;
