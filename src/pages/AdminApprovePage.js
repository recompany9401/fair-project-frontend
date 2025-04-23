import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminApprovePage() {
  const navigate = useNavigate();

  const [unapprovedBusinesses, setUnapprovedBusinesses] = useState([]);
  const [unapprovedBuyers, setUnapprovedBuyers] = useState([]);

  useEffect(() => {
    fetchUnapproved();
  }, []);

  const fetchUnapproved = async () => {
    try {
      const bizRes = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/admin/businesses?approved=false"
      );
      const bizData = await bizRes.json();

      const buyerRes = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/admin/buyers?approved=false"
      );
      const buyerData = await buyerRes.json();

      if (bizRes.ok) {
        setUnapprovedBusinesses(bizData);
      } else {
        console.error("미승인 사업자 조회 실패:", bizData.message);
      }
      if (buyerRes.ok) {
        setUnapprovedBuyers(buyerData);
      } else {
        console.error("미승인 입주자 조회 실패:", buyerData.message);
      }
    } catch (err) {
      console.error("미승인 계정 조회 오류:", err);
    }
  };

  const handleBusinessClick = (businessId) => {
    navigate(`/admin/approve-detail/business/${businessId}`);
  };
  const handleBuyerClick = (buyerId) => {
    navigate(`/admin/approve-detail/buyer/${buyerId}`);
  };

  return (
    <div style={{ width: "800px", margin: "40px auto" }}>
      <h2>가입 승인 - 미승인 계정 목록</h2>

      <div style={{ marginTop: "30px" }}>
        <h3>미승인 사업자</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>아이디</th>
              <th>상호명</th>
              <th>사업자번호</th>
            </tr>
          </thead>
          <tbody>
            {unapprovedBusinesses.map((b, idx) => (
              <tr
                key={b._id}
                style={{ cursor: "pointer" }}
                onClick={() => handleBusinessClick(b._id)}
              >
                <td>{idx + 1}</td>
                <td>{b.userId}</td>
                <td>{b.name}</td>
                <td>{b.businessNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "30px" }}>
        <h3>미승인 입주자</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th>No</th>
              <th>아이디</th>
              <th>계약자명</th>
              <th>동</th>
              <th>호</th>
            </tr>
          </thead>
          <tbody>
            {unapprovedBuyers.map((b, idx) => (
              <tr
                key={b._id}
                style={{ cursor: "pointer" }}
                onClick={() => handleBuyerClick(b._id)}
              >
                <td>{idx + 1}</td>
                <td>{b.userId}</td>
                <td>{b.name}</td>
                <td>{b.dong}</td>
                <td>{b.ho}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default AdminApprovePage;
