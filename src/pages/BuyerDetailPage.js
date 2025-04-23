// src/pages/BuyerDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BuyerDetailPage() {
  const { id } = useParams();
  const [buyer, setBuyer] = useState(null);

  // 숨길 필드 예시
  const hiddenFields = [
    "_id",
    "password",
    "approved",
    "role",
    "updatedAt",
    "__v",
    "personalInfoAgreement",
  ];

  useEffect(() => {
    fetchBuyerDetail();
  }, []);

  // (A) GET /api/admin/buyers/:id
  const fetchBuyerDetail = async () => {
    try {
      const res = await fetch(`http://localhost:3000/api/admin/buyers/${id}`);
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

  if (!buyer) {
    return <div>로딩중...</div>;
  }

  return (
    <div style={{ width: "600px", margin: "40px auto" }}>
      <h2>입주자 상세</h2>

      <h3>DB에 저장된 정보 (민감 필드 제외)</h3>
      <ul>
        {Object.entries(buyer).map(([key, value]) => {
          if (hiddenFields.includes(key)) return null;

          // createdAt → 가입 시기
          if (key === "createdAt" && value) {
            const createdTime = new Date(value).toLocaleString();
            return (
              <li key={key}>
                <strong>{key}:</strong> {createdTime}
              </li>
            );
          }

          return (
            <li key={key}>
              <strong>{key}:</strong> {String(value)}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BuyerDetailPage;
