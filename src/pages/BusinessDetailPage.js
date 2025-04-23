// src/pages/BusinessDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function BusinessDetailPage() {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);

  // 숨길 필드 예: _id, password, role, updatedAt, __v 등
  const hiddenFields = [
    "_id",
    "password",
    "role",
    "updatedAt",
    "__v",
    "approved",
  ];

  useEffect(() => {
    fetchBusinessDetail();
  }, []);

  // (A) 상세 API: GET /api/admin/businesses/:id
  const fetchBusinessDetail = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/admin/businesses/${id}`
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

  if (!business) {
    return <div>로딩중...</div>;
  }

  return (
    <div style={{ width: "600px", margin: "40px auto" }}>
      <h2>사업자 상세</h2>
      <h3>DB에 저장된 정보 (민감 필드 제외)</h3>
      <ul>
        {Object.entries(business).map(([key, value]) => {
          if (hiddenFields.includes(key)) return null;

          // createdAt → 가입 시기
          if (key === "createdAt") {
            const createdTime = new Date(value).toLocaleString();
            return (
              <li key={key}>
                <strong>{key}:</strong> {createdTime} (가입시기)
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

export default BusinessDetailPage;
