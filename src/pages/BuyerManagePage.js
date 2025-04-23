// src/pages/BuyerManagePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BuyerManagePage() {
  const navigate = useNavigate();
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    fetchBuyers();
  }, []);

  // (A) GET /api/admin/buyers?approved=true
  //     => 승인된(approved=true) 입주자만 필터링
  const fetchBuyers = async () => {
    try {
      const res = await fetch(
        "http://localhost:3000/api/admin/buyers?approved=true"
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

  // (B) 행 클릭 -> 상세 페이지로 이동
  const handleRowClick = (buyerId) => {
    // 예: "/admin/buyer-detail/:id"
    navigate(`/admin/buyer-detail/${buyerId}`);
  };

  return (
    <div style={styles.container}>
      <h2>입주자 계정 관리 (승인된 계정만)</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>아이디</th>
            <th>계약자명</th>
            <th>동</th>
            <th>호</th>
            {/* 승인여부(approved) 컬럼 제거 */}
          </tr>
        </thead>
        <tbody>
          {buyers.map((b, idx) => (
            <tr
              key={b._id}
              style={{ cursor: "pointer" }}
              onClick={() => handleRowClick(b._id)}
            >
              <td>{idx + 1}</td>
              <td>{b.userId}</td>
              <td>{b.name}</td>
              <td>{b.dong}</td>
              <td>{b.ho}</td>
              {/* 승인여부 셀 제거 */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    width: "800px",
    margin: "40px auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default BuyerManagePage;
