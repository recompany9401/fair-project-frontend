import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/PurchaseDetailPage.css";

function PurchaseDetailPage() {
  const { id } = useParams();
  const [purchase, setPurchase] = useState(null);

  const translateStatus = (status) => {
    if (!status) return "";
    if (status === "CONFIRMED") return "확정";
    if (status === "CANCELED") return "취소";
    if (status === "PENDING") return "미확정";
    return status;
  };

  useEffect(() => {
    fetchPurchaseDetail();
  }, []);

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

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    if (isNaN(dateObj.getTime())) return "";
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  return (
    <div className="ManagePage">
      <div className="detail-header">
        <img src="/images/logo-white.png" alt="logo" />
        <h2>구매 상세 정보</h2>
      </div>

      <table className="detail-table">
        <tbody>
          <tr>
            <td className="label-cell">구매자명</td>
            <td>{purchase.buyerName || "??"}</td>
          </tr>
          <tr>
            <td className="label-cell">동/호수</td>
            <td>{purchase.dongHo || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">회사명</td>
            <td>{purchase.businessName || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">품목</td>
            <td>{purchase.itemCategory}</td>
          </tr>
          <tr>
            <td className="label-cell">상품명</td>
            <td>{purchase.productName}</td>
          </tr>
          <tr>
            <td className="label-cell">옵션</td>
            <td>{purchase.option}</td>
          </tr>
          <tr>
            <td className="label-cell">판매금액</td>
            <td>{purchase.price}</td>
          </tr>
          <tr>
            <td className="label-cell">할인/할증</td>
            <td>{purchase.discountOrSurcharge || 0}</td>
          </tr>
          <tr>
            <td className="label-cell">최종금액</td>
            <td>{purchase.finalPrice}</td>
          </tr>
          <tr>
            <td className="label-cell">계약금</td>
            <td>{purchase.deposit}</td>
          </tr>
          <tr>
            <td className="label-cell">계약일자</td>
            <td>{formatDate(purchase.contractDate)}</td>
          </tr>
          <tr>
            <td className="label-cell">설치예정일</td>
            <td>{formatDate(purchase.installationDate)}</td>
          </tr>
          <tr>
            <td className="label-cell">비고</td>
            <td>{purchase.note || ""}</td>
          </tr>
          <tr>
            <td className="label-cell">상태</td>
            <td>{translateStatus(purchase.status)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseDetailPage;
