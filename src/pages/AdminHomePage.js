import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminHomePage.css";

function AdminHomePage() {
  const navigate = useNavigate();

  const goApprove = () => {
    navigate("/admin/approve");
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
    <div className="admin-page">
      <img src="/images/logo-side.png" alt="logo" />
      <h2>관리자 대시보드</h2>
      <div>
        <button onClick={goApprove}>가입 승인</button>
        <button onClick={goBusinessManage}>사업자 계정 관리</button>
        <button onClick={goBuyerManage}>입주자 계정 관리</button>
        <button onClick={goPurchaseManage}>구매 내역 조회</button>
      </div>
    </div>
  );
}

export default AdminHomePage;
