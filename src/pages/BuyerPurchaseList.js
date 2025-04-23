// src/pages/BuyerPurchaseList.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BuyerPurchaseList() {
  const navigate = useNavigate();
  const [purchaseList, setPurchaseList] = useState([]);
  const [buyerId, setBuyerId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  // 합계
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalDeposit, setTotalDeposit] = useState(0);

  useEffect(() => {
    const storedBuyerId = localStorage.getItem("buyerId");
    if (!storedBuyerId) {
      alert("로그인 필요");
      navigate("/");
      return;
    }
    setBuyerId(storedBuyerId);

    fetchPurchaseList(storedBuyerId);
  }, [navigate]);

  const fetchPurchaseList = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/purchases?buyerId=${id}`
      );
      const data = await res.json();
      if (res.ok) {
        setPurchaseList(data);
        setFilteredList(data);
        calcTotals(data);
      } else {
        console.error("구매목록 조회 실패:", data.message);
      }
    } catch (err) {
      console.error("오류:", err);
    }
  };

  const calcTotals = (list) => {
    let sumPrice = 0;
    let sumDeposit = 0;
    list.forEach((p) => {
      sumPrice += p.finalPrice || 0;
      sumDeposit += p.deposit || 0;
    });
    setTotalPrice(sumPrice);
    setTotalDeposit(sumDeposit);
  };

  // 검색
  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.toLowerCase();
    const filtered = purchaseList.filter((p) =>
      p.productName.toLowerCase().includes(term)
    );
    setFilteredList(filtered);
    calcTotals(filtered);
  };

  // 행 클릭 -> 상세 페이지로
  const handleRowClick = (purchaseId) => {
    navigate(`/buyer/purchase-detail/${purchaseId}`);
  };

  return (
    <div style={styles.container}>
      <h2>구매 리스트</h2>

      {/* 검색바 */}
      <form onSubmit={handleSearch} style={styles.searchBox}>
        <input
          type="text"
          placeholder="품명 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>
          검색
        </button>
      </form>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>No</th>
            <th>업체명</th>
            <th>품명</th>
            <th>판매금액</th>
            <th>계약금</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((p, idx) => (
            <tr key={p._id} onClick={() => handleRowClick(p._id)}>
              <td>{idx + 1}</td>
              <td>{p.businessName}</td>
              <td>{p.productName}</td>
              <td>{p.finalPrice}</td>
              <td>{p.deposit}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 합계 */}
      <div style={{ textAlign: "right", marginTop: "8px" }}>
        <p>총 금액: {totalPrice}</p>
        <p>총 계약금: {totalDeposit}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "700px",
    margin: "30px auto",
  },
  searchBox: {
    display: "flex",
    marginBottom: "12px",
  },
  searchInput: {
    flex: 1,
    padding: "8px",
  },
  searchButton: {
    padding: "8px 16px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default BuyerPurchaseList;
