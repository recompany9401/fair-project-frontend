// src/pages/PurchaseDetailPage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PurchaseDetailPage() {
  const { id } = useParams(); // purchase _id
  const [purchase, setPurchase] = useState(null);

  useEffect(() => {
    fetchPurchaseDetail();
  }, []);

  // (A) GET /api/admin/purchases/:purchaseId
  const fetchPurchaseDetail = async () => {
    try {
      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/admin/purchases/${id}`
      );
      const data = await res.json();
      if (res.ok) {
        setPurchase(data);
      } else {
        console.error("구매 상세 조회 실패:", data.message);
      }
    } catch (err) {
      console.error("구매 상세 요청 오류:", err);
    }
  };

  if (!purchase) {
    return <div>로딩중...</div>;
  }

  return (
    <div style={styles.container}>
      <h2>구매 상세 정보</h2>

      {/* 구매자명 / 동/호수 / 회사명 / 품목 / 상품명 / 옵션 */}
      <p>
        <strong>구매자명:</strong> {purchase.buyerName || "??"}
      </p>
      <p>
        <strong>동/호수:</strong> {purchase.dongHo || ""}
      </p>
      <p>
        <strong>회사명:</strong> {purchase.businessName || ""}
      </p>
      <p>
        <strong>품목:</strong> {purchase.itemCategory}
      </p>
      <p>
        <strong>상품명:</strong> {purchase.productName}
      </p>
      <p>
        <strong>옵션:</strong> {purchase.option}
      </p>

      {/* 판매금액 / 할인/할증 / 최종금액 / 계약금 */}
      <p>
        <strong>판매금액:</strong> {purchase.price}
      </p>
      <p>
        <strong>할인/할증:</strong> {purchase.discountOrSurcharge || 0}
      </p>
      <p>
        <strong>최종금액:</strong> {purchase.finalPrice}
      </p>
      <p>
        <strong>계약금:</strong> {purchase.deposit}
      </p>

      {/* (B) 계약일자 추가 */}
      <p>
        <strong>계약일자:</strong>{" "}
        {purchase.contractDate
          ? new Date(purchase.contractDate).toLocaleDateString()
          : ""}
      </p>

      {/* 설치예정일 / 비고 / 상태 */}
      <p>
        <strong>설치예정일:</strong>{" "}
        {purchase.installationDate
          ? new Date(purchase.installationDate).toLocaleDateString()
          : ""}
      </p>
      <p>
        <strong>비고:</strong> {purchase.note || ""}
      </p>
      <p>
        <strong>상태:</strong> {purchase.status}
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: "600px",
    margin: "40px auto",
  },
};

export default PurchaseDetailPage;
