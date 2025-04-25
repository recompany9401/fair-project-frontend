import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/AdminDetailPage.css";

function BusinessDetailPage() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);

  const hiddenFields = [
    "_id",
    "password",
    "role",
    "updatedAt",
    "__v",
    "approved",
  ];

  const labelMap = {
    userId: "아이디",
    name: "사업자명",
    businessNumber: "사업자번호",
    representativeName: "대표자명",
    address: "주소",
    businessType: "업태",
    businessCategory: "종목",
    managerName: "담당자이름",
    phoneNumber: "연락처",
    createdAt: "가입일자",
  };

  useEffect(() => {
    fetchBusinessDetail();
  }, []);

  const fetchBusinessDetail = async () => {
    try {
      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/admin/businesses/${id}`
      );
      if (!res.ok) {
        const errData = await res.json();
        console.error("사업자 상세 조회 실패:", errData.message);
        return;
      }
      const data = await res.json();
      setBusiness(data);
    } catch (err) {
      console.error("사업자 상세 조회 오류:", err);
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

  if (!business) {
    return <div>로딩중...</div>;
  }

  return (
    <div className="admin-detail">
      <div className="detail-header">
        <img src="/images/logo-white.png" alt="logo" />
        <h2>사업자 상세 정보</h2>
      </div>

      <div className="detail-card">
        <ul>
          {Object.entries(business).map(([key, value]) => {
            if (hiddenFields.includes(key) || !labelMap[key]) {
              return null;
            }

            if (key === "createdAt") {
              const dateStr = formatDate(value);
              return (
                <li key={key}>
                  <strong>{labelMap[key]}</strong> {dateStr}
                </li>
              );
            }

            return (
              <li key={key}>
                <strong>{labelMap[key]}</strong> {String(value)}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default BusinessDetailPage;
