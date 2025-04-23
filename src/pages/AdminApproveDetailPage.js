// src/pages/AdminApproveDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AdminApproveDetailPage() {
  const navigate = useNavigate();
  const { type, id } = useParams();
  // type: "business" or "buyer"
  // id: 문서 _id

  const [account, setAccount] = useState(null);

  // 숨길 필드를 배열에 정의
  const hiddenFields = [
    "_id",
    "role",
    "approved",
    "updatedAt",
    "__v",
    "personalInfoAgreement",
    "password",
  ];

  useEffect(() => {
    fetchAccountDetail();
  }, []);

  // (A) 상세 정보 조회
  async function fetchAccountDetail() {
    try {
      let url = "";
      if (type === "business") {
        url = `http://localhost:3000/api/admin/businesses/${id}`;
      } else if (type === "buyer") {
        url = `http://localhost:3000/api/admin/buyers/${id}`;
      } else {
        console.error("잘못된 type:", type);
        return;
      }

      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json();
        console.error("상세 조회 실패:", errData.message);
        return;
      }
      const data = await res.json();
      setAccount(data);
    } catch (err) {
      console.error("계정 상세 조회 오류:", err);
    }
  }

  // (B) 가입 승인 처리
  async function handleApprove() {
    try {
      let url = "";
      if (type === "business") {
        url = `http://localhost:3000/api/admin/business/${id}/approve`;
      } else {
        // type === "buyer"
        url = `http://localhost:3000/api/admin/buyer/${id}/approve`;
      }

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(`승인 실패: ${data.message}`);
        return;
      }
      // 성공
      alert(data.message || "가입 승인 완료!");

      // (B-1) account도 갱신(approved:true)
      setAccount((prev) => ({ ...prev, approved: true }));
    } catch (err) {
      console.error("가입 승인 오류:", err);
      alert("서버 오류!");
    }
  }

  if (!account) {
    return <div>로딩중...</div>;
  }

  // (C) 정보 표시 + (가입 승인) 버튼
  return (
    <div style={styles.container}>
      <h2>{type === "business" ? "사업자 상세" : "입주자 상세"}</h2>

      <h3>DB에 저장된 정보 (일부 필드 숨김)</h3>
      <ul>
        {Object.entries(account).map(([key, value]) => {
          if (hiddenFields.includes(key)) return null;

          if (key === "createdAt" && value) {
            const joinedTime = new Date(value).toLocaleString();
            return (
              <li key={key}>
                <strong>{key}:</strong> {joinedTime} (가입시기)
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

      {/* (C-1) approved 상태가 false일 때만 “가입 승인” 버튼 노출 */}
      {!account.approved && (
        <button style={styles.approveBtn} onClick={handleApprove}>
          가입 승인
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    width: "600px",
    margin: "40px auto",
    textAlign: "left",
  },
  approveBtn: {
    marginTop: "20px",
    padding: "10px 16px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AdminApproveDetailPage;
