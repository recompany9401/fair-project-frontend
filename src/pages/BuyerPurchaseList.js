import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BuyerPurchaseList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faRectangleList,
  faMagnifyingGlass,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";

function BuyerPurchaseList() {
  const navigate = useNavigate();
  const [purchaseList, setPurchaseList] = useState([]);
  const [buyerId, setBuyerId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredList, setFilteredList] = useState([]);

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
        `https://fair-project-backend-production.up.railway.app/api/purchases?buyerId=${id}`
      );
      const data = await res.json();
      if (res.ok) {
        data.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });

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

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.toLowerCase();
    const filtered = purchaseList.filter((p) =>
      p.productName.toLowerCase().includes(term)
    );
    setFilteredList(filtered);
    calcTotals(filtered);
  };

  const handleRowClick = (purchaseId) => {
    navigate(`/buyer/purchase-detail/${purchaseId}`);
  };

  const handleGoHome = () => {
    navigate("/buyer-home");
  };

  const handleGoUser = () => {
    navigate("/buyer-info");
  };

  return (
    <div className="buyer-purchase">
      <div className="top-banner">
        <button className="user-btn" onClick={handleGoUser}>
          <FontAwesomeIcon icon={faCircleUser} />
        </button>
        <img src="/images/logo-white.png" alt="logo" />
        <div className="purchase-btn">
          <h2 onClick={handleGoHome}>
            <FontAwesomeIcon icon={faCartShopping} />
            구매 정보 입력
          </h2>
          <button>
            <FontAwesomeIcon icon={faRectangleList} />
            구매 리스트
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="품명을 입력해 주세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>

      <h3 className="total-count">
        total <span>{filteredList.length}</span>
      </h3>

      <table className="purchase-table">
        <thead>
          <tr>
            <th>업체명</th>
            <th>품명</th>
            <th>판매금액</th>
            <th>계약금</th>
          </tr>
        </thead>
        <tbody>
          {filteredList.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-result">
                검색된 내역이 없습니다.
              </td>
            </tr>
          ) : (
            filteredList.map((p, idx) => (
              <tr key={p._id} onClick={() => handleRowClick(p._id)}>
                <td>{p.businessName}</td>
                <td>{p.productName}</td>
                <td>{(p.finalPrice || 0).toLocaleString()}</td>
                <td>{(p.deposit || 0).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="totals">
        <p>
          총 금액 <span>{totalPrice.toLocaleString()}원</span>
        </p>
        <p>
          총 계약금 <span>{totalDeposit.toLocaleString()}원</span>
        </p>
      </div>
    </div>
  );
}

export default BuyerPurchaseList;
