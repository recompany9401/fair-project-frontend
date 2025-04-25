import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManagePage.css";

function BusinessManagePage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      const res = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/admin/businesses?approved=true"
      );
      const data = await res.json();
      if (res.ok) {
        setBusinesses(data);
      } else {
        console.error("사업자 리스트 조회 실패:", data.message);
      }
    } catch (err) {
      console.error("사업자 리스트 요청 오류:", err);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/admin/business-detail/${id}`);
  };

  return (
    <div className="ManagePage">
      <div className="detail-header">
        <img src="/images/logo-white.png" alt="logo" />
        <h2>사업자 계정 관리</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>아이디</th>
            <th>업체명</th>
            <th>사업자번호</th>
          </tr>
        </thead>
        <tbody>
          {businesses.map((b, idx) => (
            <tr key={b._id} onClick={() => handleRowClick(b._id)}>
              <td>{idx + 1}</td>
              <td>{b.userId}</td>
              <td>{b.name}</td>
              <td>{b.businessNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BusinessManagePage;
