import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AdminApproveDetailPage() {
  const navigate = useNavigate();
  const { type, id } = useParams();

  const [account, setAccount] = useState(null);

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

  async function fetchAccountDetail() {
    try {
      let url = "";
      if (type === "business") {
        url = `https://fair-project-backend-production.up.railway.app/api/admin/businesses/${id}`;
      } else if (type === "buyer") {
        url = `https://fair-project-backend-production.up.railway.app/api/admin/buyers/${id}`;
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

  async function handleApprove() {
    try {
      let url = "";
      if (type === "business") {
        url = `https://fair-project-backend-production.up.railway.app/api/admin/business/${id}/approve`;
      } else {
        url = `https://fair-project-backend-production.up.railway.app/api/admin/buyer/${id}/approve`;
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
      alert(data.message || "가입 승인 완료!");

      setAccount((prev) => ({ ...prev, approved: true }));
    } catch (err) {
      console.error("가입 승인 오류:", err);
      alert("서버 오류!");
    }
  }

  if (!account) {
    return <div>로딩중...</div>;
  }

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
