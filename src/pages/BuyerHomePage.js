import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BuyerHomePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faRectangleList,
} from "@fortawesome/free-solid-svg-icons";

function BuyerHomePage() {
  const navigate = useNavigate();
  const alreadyNavigated = useRef(false);

  const [allProducts, setAllProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  const [price, setPrice] = useState(0);
  const [discountOrSurcharge, setDiscountOrSurcharge] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [contractDate, setContractDate] = useState("");
  const [installationDate, setInstallationDate] = useState("");
  const [note, setNote] = useState("");

  const [buyerId, setBuyerId] = useState("");
  const [businessId, setBusinessId] = useState("");

  useEffect(() => {
    const storedBuyerId = localStorage.getItem("buyerId");
    if (!storedBuyerId) {
      if (!alreadyNavigated.current) {
        alreadyNavigated.current = true;
        alert("로그인이 필요합니다. 로그인 페이지로 이동");
        navigate("/");
      }
      return;
    }
    setBuyerId(storedBuyerId);

    const storedBizId = localStorage.getItem("businessId");
    if (storedBizId) {
      setBusinessId(storedBizId);
    }

    fetchAllProducts();
  }, [navigate]);

  const fetchAllProducts = async () => {
    try {
      const response = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/products/all"
      );
      const data = await response.json();
      if (response.ok) {
        setAllProducts(data);
      } else {
        console.error("상품 목록 조회 실패:", data.message);
      }
    } catch (err) {
      console.error("상품 목록 요청 오류:", err);
    }
  };

  const categories = [
    ...new Set(allProducts.map((p) => p.itemCategory)),
  ].sort();
  const businessList = [
    ...new Set(
      allProducts
        .filter((p) => p.itemCategory === selectedCategory)
        .map((p) => p.businessName)
    ),
  ].sort();
  const productList = [
    ...new Set(
      allProducts
        .filter(
          (p) =>
            p.itemCategory === selectedCategory &&
            p.businessName === selectedBusiness
        )
        .map((p) => p.productName)
    ),
  ].sort();
  const optionList = [
    ...new Set(
      allProducts
        .filter(
          (p) =>
            p.itemCategory === selectedCategory &&
            p.businessName === selectedBusiness &&
            p.productName === selectedProduct
        )
        .map((p) => p.option)
    ),
  ].sort();

  useEffect(() => {
    const match = allProducts.find(
      (p) =>
        p.itemCategory === selectedCategory &&
        p.businessName === selectedBusiness &&
        p.productName === selectedProduct &&
        p.option === selectedOption
    );
    if (match) {
      setPrice(match.price || 0);
    } else {
      setPrice(0);
    }
  }, [
    selectedCategory,
    selectedBusiness,
    selectedProduct,
    selectedOption,
    allProducts,
  ]);

  useEffect(() => {
    const p = Number(price) || 0;
    const d = Number(discountOrSurcharge) || 0;
    setFinalPrice(p - d);
  }, [price, discountOrSurcharge]);

  const handleSubmitPurchase = async (e) => {
    e.preventDefault();
    if (!buyerId) {
      alert("BuyerId가 없습니다.");
      return;
    }

    const bodyData = {
      buyerId,
      businessId,
      itemCategory: selectedCategory,
      businessName: selectedBusiness,
      productName: selectedProduct,
      option: selectedOption,
      price: Number(price),
      discountOrSurcharge: Number(discountOrSurcharge),
      finalPrice,
      deposit: Number(deposit),
      contractDate: contractDate || null,
      installationDate: installationDate || null,
      note: note || "",
    };

    try {
      const response = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/purchases",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        }
      );
      const data = await response.json();
      if (response.ok) {
        alert("구매 정보 등록을 완료했습니다.");
        resetForm();
      } else {
        alert(`오류: ${data.message}`);
      }
    } catch (err) {
      console.error("구매 등록 오류:", err);
    }
  };

  const resetForm = () => {
    setSelectedCategory("");
    setSelectedBusiness("");
    setSelectedProduct("");
    setSelectedOption("");
    setPrice(0);
    setDiscountOrSurcharge(0);
    setFinalPrice(0);
    setDeposit(0);
    setContractDate("");
    setInstallationDate("");
    setNote("");
  };

  const handleGoList = () => {
    navigate("/buyer-purchase-list");
  };

  return (
    <div className="buyer-page">
      <div className="top-banner">
        <img src="/images/logo-white.png" alt="logo" />
        <div className="top-btn">
          <h2>
            <FontAwesomeIcon icon={faCartShopping} />
            구매 정보 입력
          </h2>
          <button onClick={handleGoList}>
            <FontAwesomeIcon icon={faRectangleList} />
            구매 리스트
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmitPurchase}>
        <div>
          <label>품목</label>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedBusiness("");
              setSelectedProduct("");
              setSelectedOption("");
            }}
            required
          >
            <option value="">선택</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>업체명</label>
          <select
            value={selectedBusiness}
            onChange={(e) => {
              setSelectedBusiness(e.target.value);
              setSelectedProduct("");
              setSelectedOption("");
            }}
            required
          >
            <option value="">선택</option>
            {businessList.map((biz, idx) => (
              <option key={idx} value={biz}>
                {biz}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>상품명</label>
          <select
            value={selectedProduct}
            onChange={(e) => {
              setSelectedProduct(e.target.value);
              setSelectedOption("");
            }}
            required
          >
            <option value="">선택</option>
            {productList.map((prod, idx) => (
              <option key={idx} value={prod}>
                {prod}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>옵션</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            required
          >
            <option value="">선택</option>
            {optionList.map((opt, idx) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>판매가</label>
          <input type="number" value={price} readOnly />
        </div>

        <div>
          <label>할인/할증</label>
          <input
            type="number"
            value={discountOrSurcharge}
            onChange={(e) => setDiscountOrSurcharge(e.target.value)}
          />
        </div>

        <div>
          <label>최종금액</label>
          <input type="number" value={finalPrice} readOnly />
        </div>

        <div>
          <label>계약금</label>
          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
          />
        </div>

        <div>
          <label>계약일자</label>
          <input
            type="date"
            value={contractDate}
            onChange={(e) => setContractDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>설치예정일</label>
          <input
            type="date"
            value={installationDate}
            onChange={(e) => setInstallationDate(e.target.value)}
          />
        </div>

        <div>
          <label>비고</label>
          <textarea
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <button type="submit">구매 정보 등록</button>
      </form>
    </div>
  );
}

export default BuyerHomePage;
