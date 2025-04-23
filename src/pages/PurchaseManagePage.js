// src/pages/PurchaseManagePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PurchaseManagePage() {
  const navigate = useNavigate();

  // 검색 필드
  const [searchField, setSearchField] = useState("buyerName");
  const [searchKeyword, setSearchKeyword] = useState("");

  // 구매 내역
  const [purchases, setPurchases] = useState([]);

  // 정렬 상태: (컬럼: "buyerName", "dongHo", "businessName", "contractDate" 등), order: "asc" | "desc"
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchPurchases();
  }, []);

  // 데이터 불러오기
  const fetchPurchases = async () => {
    try {
      let url = "http://localhost:3000/api/admin/purchases";
      if (searchKeyword) {
        // 검색 API 예시: ?field=...&keyword=...
        url += `?field=${encodeURIComponent(
          searchField
        )}&keyword=${encodeURIComponent(searchKeyword)}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setPurchases(data);
      } else {
        console.error("구매 내역 조회 실패:", data.message);
      }
    } catch (err) {
      console.error("구매 내역 요청 오류:", err);
    }
  };

  // 검색 처리
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPurchases();
  };

  // 테이블 행 클릭 -> 상세 페이지 이동
  const handleRowClick = (purchaseId) => {
    navigate(`/admin/purchase-detail/${purchaseId}`);
  };

  // 정렬 함수
  const handleSort = (field) => {
    if (sortField === field) {
      // 이미 같은 컬럼 -> 오름<->내림 토글
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // 새로운 컬럼 -> 오름차순 초기화
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // 실제 정렬된 배열 만들기
  const getSortedPurchases = () => {
    const sorted = [...purchases];
    if (!sortField) {
      return sorted; // 정렬 안 함
    }

    sorted.sort((a, b) => {
      // 특별히 contractDate만 '날짜' 비교, 나머지는 문자열
      if (sortField === "contractDate") {
        // 날짜 비교
        const dateA = a.contractDate ? new Date(a.contractDate).getTime() : 0;
        const dateB = b.contractDate ? new Date(b.contractDate).getTime() : 0;
        if (dateA === dateB) return 0;
        if (dateA < dateB) return sortOrder === "asc" ? -1 : 1;
        return sortOrder === "asc" ? 1 : -1;
      } else {
        // 기존 문자열 비교 (예: buyerName, dongHo, businessName, ...)
        let valA = a[sortField] || "";
        let valB = b[sortField] || "";
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
        if (valA === valB) return 0;
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        return sortOrder === "asc" ? 1 : -1;
      }
    });

    return sorted;
  };

  // 정렬된 목록
  const sortedPurchases = getSortedPurchases();

  // 각 컬럼 헤더에 화살표 표시
  const renderSortArrow = (field) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? "▲" : "▼";
  };

  return (
    <div style={styles.container}>
      <h2>구매 내역 조회(관리자)</h2>

      {/* 검색 폼 */}
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <div>
          <label>검색 항목:</label>
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="buyerName">구매자명</option>
            <option value="businessName">회사명</option>
            <option value="itemCategory">품목</option>
            <option value="productName">상품명</option>
            <option value="option">옵션</option>
          </select>
        </div>
        <div>
          <label>검색어:</label>
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
        <button type="submit">검색</button>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>No</th>

            <th
              style={styles.clickable}
              onClick={() => handleSort("buyerName")}
            >
              구매자명 {renderSortArrow("buyerName")}
            </th>
            <th style={styles.clickable} onClick={() => handleSort("dongHo")}>
              동/호수 {renderSortArrow("dongHo")}
            </th>
            <th
              style={styles.clickable}
              onClick={() => handleSort("businessName")}
            >
              회사명 {renderSortArrow("businessName")}
            </th>

            <th>품목</th>
            <th>상품명</th>
            <th>옵션</th>
            <th>판매금액</th>
            <th>계약금</th>

            {/* (1) 새 열: 계약일자 - 정렬 가능 */}
            <th
              style={styles.clickable}
              onClick={() => handleSort("contractDate")}
            >
              계약일자 {renderSortArrow("contractDate")}
            </th>

            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {sortedPurchases.map((p, idx) => (
            <tr
              key={p._id}
              style={{ cursor: "pointer" }}
              onClick={() => handleRowClick(p._id)}
            >
              <td>{idx + 1}</td>
              <td>{p.buyerName || "??"}</td>
              <td>{p.dongHo || ""}</td>
              <td>{p.businessName || ""}</td>
              <td>{p.itemCategory}</td>
              <td>{p.productName}</td>
              <td>{p.option}</td>
              <td>{p.finalPrice}</td>
              <td>{p.deposit}</td>

              {/* (2) 계약일자 셀: 날짜 포맷 */}
              <td>
                {p.contractDate
                  ? new Date(p.contractDate).toLocaleDateString()
                  : ""}
              </td>

              <td>{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 스타일
const styles = {
  container: {
    width: "800px",
    margin: "40px auto",
  },
  searchForm: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  clickable: {
    cursor: "pointer",
    userSelect: "none",
  },
};

export default PurchaseManagePage;
