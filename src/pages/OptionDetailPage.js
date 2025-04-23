// src/pages/OptionDetailPage.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * 사업자 로그인 후,
 * URL 예: /business/option-detail?businessId=...&itemCategory=...&productName=...&option=...
 * 필터로 Purchase DB 조회
 */
function OptionDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const businessId = searchParams.get("businessId");
  const itemCategory = searchParams.get("itemCategory");
  const productName = searchParams.get("productName");
  const option = searchParams.get("option");

  // 구매 목록 state
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (!businessId) {
      alert("businessId가 없습니다. 로그인 페이지로 이동합니다.");
      navigate("/");
      return;
    }

    fetchOptionPurchases();
  }, [businessId, itemCategory, productName, option, navigate]);

  // (A) 해당 옵션의 구매 목록 가져오기
  const fetchOptionPurchases = async () => {
    try {
      const query = `businessId=${encodeURIComponent(
        businessId
      )}&itemCategory=${encodeURIComponent(
        itemCategory
      )}&productName=${encodeURIComponent(
        productName
      )}&option=${encodeURIComponent(option)}`;

      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/purchases/by-option?${query}`
      );
      const data = await res.json();

      if (res.ok) {
        setPurchases(data);
      } else {
        console.error("옵션 구매내역 실패:", data.message);
      }
    } catch (err) {
      console.error("옵션 구매내역 오류:", err);
    }
  };

  // (B) 상태 업데이트(확인/취소) => 즉시 DB PATCH
  const handleStatusUpdate = async (purchaseId, newStatus) => {
    try {
      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/purchases/${purchaseId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        // 로컬 state 갱신
        setPurchases((prev) =>
          prev.map((p) =>
            p._id === purchaseId ? { ...p, status: newStatus } : p
          )
        );
      } else {
        console.error("상태 변경 실패:", data.message);
      }
    } catch (err) {
      console.error("상태 변경 오류:", err);
    }
  };

  return (
    <div style={styles.container}>
      <h2>옵션 상세 페이지(사업자)</h2>
      <p>
        품목: {itemCategory} / 상품명: {productName} / 옵션: {option}
      </p>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>계약일자</th>
            <th>계약자명</th>
            <th>동/호수</th>
            <th>판매금액</th>
            <th>계약금</th>
            <th>확인</th>
            <th>취소</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p, idx) => {
            const isConfirmed = p.status === "CONFIRMED";
            const isCanceled = p.status === "CANCELED";
            return (
              <tr key={p._id}>
                <td>{idx + 1}</td>
                <td>
                  {p.contractDate
                    ? new Date(p.contractDate).toLocaleDateString()
                    : ""}
                </td>
                <td>{p.buyerName || "??"}</td>
                <td>{p.dongHo || "??"}</td>
                <td>{p.finalPrice}</td>
                <td>{p.deposit || 0}</td>

                <td>
                  <button
                    style={{
                      backgroundColor: isConfirmed ? "red" : "",
                      color: isConfirmed ? "#fff" : "",
                    }}
                    onClick={() => handleStatusUpdate(p._id, "CONFIRMED")}
                  >
                    확인
                  </button>
                </td>
                <td>
                  <button
                    style={{
                      backgroundColor: isCanceled ? "red" : "",
                      color: isCanceled ? "#fff" : "",
                    }}
                    onClick={() => handleStatusUpdate(p._id, "CANCELED")}
                  >
                    취소
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const styles = {
  container: {
    width: "800px",
    margin: "30px auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "16px",
  },
};

export default OptionDetailPage;
