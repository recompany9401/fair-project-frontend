import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManagePage.css";

function BuyerManagePage() {
  const navigate = useNavigate();
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const res = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/admin/buyers?approved=true"
      );
      const data = await res.json();
      if (res.ok) {
        setBuyers(data);
      } else {
        console.error("입주자 리스트 조회 실패:", data.message);
      }
    } catch (err) {
      console.error("입주자 리스트 요청 오류:", err);
    }
  };

  const handleRowClick = (buyerId) => {
    navigate(`/admin/buyer-detail/${buyerId}`);
  };

  return (
    <div className="ManagePage">
      <div className="detail-header">
        <img src="/images/logo-white.png" alt="logo" />
        <h2>입주자 계정 관리</h2>
      </div>
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>아이디</th>
            <th>계약자명</th>
            <th>동/호수</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map((b, idx) => (
            <tr key={b._id} onClick={() => handleRowClick(b._id)}>
              <td>{idx + 1}</td>
              <td>{b.userId}</td>
              <td>{b.name}</td>
              <td>
                {b.dong}동 {b.ho}호
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BuyerManagePage;
