// src/pages/AdminHomePage.js
import React from "react";
import { useNavigate } from "react-router-dom";

function AdminHomePage() {
  const navigate = useNavigate();

  // 버튼 클릭 -> 라우터 이동
  const goApprove = () => {
    navigate("/admin/approve"); // ★ 새 페이지
  };
  const goBusinessManage = () => {
    navigate("/admin/business-manage");
  };
  const goBuyerManage = () => {
    navigate("/admin/buyer-manage");
  };
  const goPurchaseManage = () => {
    navigate("/admin/purchase-manage");
  };

  return (
    <div style={styles.container}>
      <h2>관리자 대시보드</h2>
      <div style={styles.menu}>
        {/* ★ 추가된 “가입 승인” 버튼 (맨 위) */}
        <button onClick={goApprove} style={styles.btn}>
          가입 승인
        </button>

        <button onClick={goBusinessManage} style={styles.btn}>
          사업자 계정 관리
        </button>
        <button onClick={goBuyerManage} style={styles.btn}>
          입주자 계정 관리
        </button>
        <button onClick={goPurchaseManage} style={styles.btn}>
          구매 내역 조회
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "600px",
    margin: "40px auto",
    textAlign: "center",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginTop: "30px",
  },
  btn: {
    padding: "10px 16px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default AdminHomePage;
