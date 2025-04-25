import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/AdminDetailPage.css";

function BuyerDetailPage() {
  const { id } = useParams();
  const [buyer, setBuyer] = useState(null);

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
    } catch (err) {
      console.error("입주자 상세 조회 오류:", err);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return "";
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const formatGender = (g) => {
    if (g === "M") return "남성";
    if (g === "F") return "여성";
    return "기타";
  };

  if (!buyer) {
    return <div>로딩중...</div>;
  }

  const dongHoStr =
    buyer.dong && buyer.ho ? `${buyer.dong}동 ${buyer.ho}호` : "";

  const displayFields = [
    { label: "아이디", value: buyer.userId },
    { label: "이름", value: buyer.name },
    { label: "전화번호", value: buyer.phoneNumber },
    { label: "동/호수", value: dongHoStr },
    { label: "생년월일", value: formatDate(buyer.birthDate) },
    { label: "성별", value: formatGender(buyer.gender) },
    { label: "세대원수", value: buyer.householdCount },
    { label: "가입일자", value: formatDate(buyer.createdAt) },
  ];

  return (
    <div className="admin-detail">
      <div className="detail-header">
        <img src="/images/logo-white.png" alt="logo" />
        <h2>입주자 상세 정보</h2>
      </div>

      <div className="detail-card">
        <ul>
          {displayFields.map((field, idx) => (
            <li key={idx}>
              <strong>{field.label}</strong> {field.value || ""}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BuyerDetailPage;
