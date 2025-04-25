import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AdminApproveDetailPage.css";

function AdminApproveDetailPage() {
  const navigate = useNavigate();
  const { type, id } = useParams();

  const [account, setAccount] = useState(null);

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
      alert(data.message || "가입 승인 완료");
      setAccount((prev) => ({ ...prev, approved: true }));
    } catch (err) {
      console.error("가입 승인 오류:", err);
      alert("서버 오류");
    }
  }

  function handleGoBack() {
    const activeTab = type === "buyer" ? "buyer" : "business";
    navigate("/admin/approve", { state: { activeTab } });
  }

  if (!account) {
    return <div className="detail-loading">로딩중...</div>;
  }

  function formatDateOnly(value) {
    if (!value) return "";
    const dateObj = new Date(value);
    if (isNaN(dateObj.getTime())) return "";
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }

  function formatGender(g) {
    if (g === "M") return "남자";
    if (g === "F") return "여자";
    return "기타";
  }

  let displayFields = [];

  if (type === "business") {
    displayFields = [
      { label: "아이디", value: account.userId },
      { label: "사업자명", value: account.name },
      { label: "사업자번호", value: account.businessNumber },
      { label: "대표자명", value: account.representativeName },
      { label: "주소", value: account.address },
      { label: "업태", value: account.businessType },
      { label: "종목", value: account.businessCategory },
      { label: "담당자이름", value: account.managerName },
      { label: "연락처", value: account.phoneNumber },
      { label: "가입일자", value: formatDateOnly(account.createdAt) },
    ];
  } else {
    const dongHoStr =
      account.dong && account.ho ? `${account.dong}동 ${account.ho}호` : "";

    displayFields = [
      { label: "아이디", value: account.userId },
      { label: "이름", value: account.name },
      { label: "전화번호", value: account.phoneNumber },
      { label: "동/호수", value: dongHoStr },
      { label: "생년월일", value: formatDateOnly(account.birthDate) },
      { label: "성별", value: formatGender(account.gender) },
      { label: "세대원수", value: account.householdCount },
      { label: "가입일자", value: formatDateOnly(account.createdAt) },
    ];
  }

  return (
    <div className="approve-detail-page">
      <div className="detail-header">
        <img src="/images/logo-white.png" alt="logo" />
        <h2>{type === "business" ? "사업자 상세" : "입주자 상세"}</h2>
      </div>

      <div className="detail-card">
        <ul>
          {displayFields.map((field, idx) => (
            <li key={idx}>
              <strong className="field-label">{field.label}</strong>
              <span className="field-value">{field.value || ""}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="detail-buttons">
        {!account.approved && (
          <button className="approve-btn" onClick={handleApprove}>
            가입 승인
          </button>
        )}
        <button className="back-btn" onClick={handleGoBack}>
          뒤로가기
        </button>
      </div>
    </div>
  );
}

export default AdminApproveDetailPage;
