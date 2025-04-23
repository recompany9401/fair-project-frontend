// src/pages/BusinessManagePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BusinessManagePage() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    fetchBusinesses();
  }, []);

  // (A) 관리자 API: GET /api/admin/businesses?approved=true
  //     => 승인된(approved=true) 사업자만 필터링
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

  // (B) 행 클릭 -> 상세 페이지 이동
  const handleRowClick = (id) => {
    // 예: /admin/business-detail/:id 로 이동
    navigate(`/admin/business-detail/${id}`);
  };

  return (
    <div style={styles.container}>
      <h2>사업자 계정 관리 (승인된 계정만)</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>아이디</th>
            <th>상호명</th>
            <th>사업자번호</th>
            {/* 승인여부 컬럼 제거 */}
          </tr>
        </thead>
        <tbody>
          {businesses.map((b, idx) => (
            <tr
              key={b._id}
              style={{ cursor: "pointer" }}
              onClick={() => handleRowClick(b._id)}
            >
              <td>{idx + 1}</td>
              <td>{b.userId}</td>
              <td>{b.name}</td>
              <td>{b.businessNumber}</td>
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

export default BusinessManagePage;
