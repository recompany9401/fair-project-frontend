import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/OptionDetailPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function OptionDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // URL 파라미터 추출
  const searchParams = new URLSearchParams(location.search);
  const businessId = searchParams.get("businessId");
  const itemCategory = searchParams.get("itemCategory");
  const productName = searchParams.get("productName");
  const option = searchParams.get("option");

  // 구매 목록 + 검색어
  const [purchases, setPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // 처음 진입 시, businessId 없으면 로그인으로 이동. 있으면 데이터 Fetch
  useEffect(() => {
    if (!businessId) {
      alert("businessId가 없습니다. 로그인 페이지로 이동합니다.");
      navigate("/");
      return;
    }
    fetchOptionPurchases("");
    // eslint-disable-next-line
  }, [businessId, itemCategory, productName, option, navigate]);

  // 검색 폼 제출 시
  const handleSearch = (e) => {
    e.preventDefault();
    // 입력한 검색어를 포함하여 다시 서버에 요청
    fetchOptionPurchases(searchTerm);
  };

  // 서버로부터 옵션별 구매 내역(계약자명 검색 포함) 가져오기
  const fetchOptionPurchases = async (searchKeyword) => {
    try {
      // 기본 쿼리
      let query =
        `businessId=${encodeURIComponent(businessId)}` +
        `&itemCategory=${encodeURIComponent(itemCategory)}` +
        `&productName=${encodeURIComponent(productName)}` +
        `&option=${encodeURIComponent(option)}`;

      // 검색어가 있으면 쿼리에 추가
      if (searchKeyword) {
        query += `&search=${encodeURIComponent(searchKeyword)}`;
      }

      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/purchases/by-option?${query}`
      );
      const data = await res.json();

      if (res.ok) {
        // 구매 내역 상태 업데이트
        setPurchases(data);
      } else {
        console.error("옵션 구매내역 실패:", data.message);
      }
    } catch (err) {
      console.error("옵션 구매내역 오류:", err);
    }
  };

  // 구매 상태(확인/취소) 변경
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
        // 상태 업데이트 성공 시 로컬 state에서 반영
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
    <div className="option-detail">
      {/* 상단 로고 */}
      <img src="/images/logo-side.png" alt="logo" className="detail-logo" />
      {/* 제목 */}
      <h2 className="detail-title">구매리스트</h2>
      {/* 품목 / 상품명 / 옵션 */}
      <p className="detail-subtitle">
        {itemCategory} / {productName} / {option}
      </p>

      {/* 검색 폼 (계약자명 검색) */}
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="계약자명을 입력하세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>

      {/* 구매 내역 카드 목록 */}
      {purchases.length === 0 ? (
        <p className="no-data">검색 결과가 없습니다.</p>
      ) : (
        purchases.map((purchase, idx) => {
          const isConfirmed = purchase.status === "CONFIRMED";
          const isCanceled = purchase.status === "CANCELED";

          return (
            <div className="purchase-card" key={purchase._id}>
              <p>
                <strong>계약일자</strong>{" "}
                {purchase.contractDate
                  ? new Date(purchase.contractDate).toISOString().slice(0, 10)
                  : ""}
              </p>
              <p>
                <strong>계약자명</strong> {purchase.buyerName || "??"}
              </p>
              <p>
                <strong>동/호수</strong> {purchase.dongHo || "??"}
              </p>
              <p>
                <strong>판매금액</strong>{" "}
                {purchase.finalPrice?.toLocaleString()}원
              </p>
              <p>
                <strong>계약금</strong> {purchase.deposit?.toLocaleString()}원
              </p>

              <div className="purchase-buttons">
                <button
                  className={`confirm-btn ${isConfirmed ? "active" : ""}`}
                  onClick={() => handleStatusUpdate(purchase._id, "CONFIRMED")}
                >
                  확인
                </button>
                <button
                  className={`cancel-btn ${isCanceled ? "active" : ""}`}
                  onClick={() => handleStatusUpdate(purchase._id, "CANCELED")}
                >
                  취소
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default OptionDetailPage;
