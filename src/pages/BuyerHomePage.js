// src/pages/BuyerHomePage.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function BuyerHomePage() {
  const navigate = useNavigate();
  const alreadyNavigated = useRef(false);

  // 전체 상품 목록
  const [allProducts, setAllProducts] = useState([]);

  // 선택 상태
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedOption, setSelectedOption] = useState("");

  // 폼 필드
  const [price, setPrice] = useState(0);
  const [discountOrSurcharge, setDiscountOrSurcharge] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [deposit, setDeposit] = useState(0);
  const [contractDate, setContractDate] = useState("");
  const [installationDate, setInstallationDate] = useState("");
  const [note, setNote] = useState("");

  // buyerId (입주자)
  const [buyerId, setBuyerId] = useState("");
  // businessId (사업자) - 입주자가 사업자 ID를 어떻게 얻는지는 프로젝트 상황에 따라
  const [businessId, setBusinessId] = useState("");

  useEffect(() => {
    // 1) 로그인 체크
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

    // 2) (예) 로컬스토리지에 businessId가 있다면 가져오기
    //    실제론 입주자일 때 사업자ID를 선택하는 UX일 수도 있음
    const storedBizId = localStorage.getItem("businessId");
    if (storedBizId) {
      setBusinessId(storedBizId);
    }

    // 3) 상품 목록 가져오기
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

  // 필터링
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

  // 옵션 선택 시 가격 매칭
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

  // 최종금액 계산
  useEffect(() => {
    const p = Number(price) || 0;
    const d = Number(discountOrSurcharge) || 0;
    setFinalPrice(p - d);
  }, [price, discountOrSurcharge]);

  // 구매 등록
  const handleSubmitPurchase = async (e) => {
    e.preventDefault();
    if (!buyerId) {
      alert("BuyerId가 없습니다.");
      return;
    }

    // 여기서 businessId를 추가
    const bodyData = {
      buyerId,
      businessId, // ★ 사업자ID (String - ObjectId 형태)
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
        alert("구매 정보 등록 성공!");
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

  // 구매 리스트 보기
  const handleGoList = () => {
    navigate("/buyer-purchase-list");
  };

  return (
    <div style={styles.container}>
      <h2>구매자(입주자) 페이지</h2>

      <form onSubmit={handleSubmitPurchase} style={styles.form}>
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
          <option value="">-- 선택 --</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

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
          <option value="">-- 선택 --</option>
          {businessList.map((biz, idx) => (
            <option key={idx} value={biz}>
              {biz}
            </option>
          ))}
        </select>

        <label>상품명</label>
        <select
          value={selectedProduct}
          onChange={(e) => {
            setSelectedProduct(e.target.value);
            setSelectedOption("");
          }}
          required
        >
          <option value="">-- 선택 --</option>
          {productList.map((prod, idx) => (
            <option key={idx} value={prod}>
              {prod}
            </option>
          ))}
        </select>

        <label>옵션</label>
        <select
          value={selectedOption}
          onChange={(e) => setSelectedOption(e.target.value)}
          required
        >
          <option value="">-- 선택 --</option>
          {optionList.map((opt, idx) => (
            <option key={idx} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <label>판매가</label>
        <input
          type="number"
          value={price}
          readOnly
          style={{ backgroundColor: "#f0f0f0" }}
        />

        <label>할인/할증</label>
        <input
          type="number"
          value={discountOrSurcharge}
          onChange={(e) => setDiscountOrSurcharge(e.target.value)}
        />

        <label>최종금액</label>
        <input
          type="number"
          value={finalPrice}
          readOnly
          style={{ backgroundColor: "#f0f0f0" }}
        />

        <label>계약금</label>
        <input
          type="number"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
        />

        <label>계약일자</label>
        <input
          type="date"
          value={contractDate}
          onChange={(e) => setContractDate(e.target.value)}
        />

        <label>설치예정일</label>
        <input
          type="date"
          value={installationDate}
          onChange={(e) => setInstallationDate(e.target.value)}
        />

        <label>비고</label>
        <textarea
          rows="3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button type="submit" style={styles.submitButton}>
          구매 정보 등록
        </button>
      </form>

      <div style={{ marginTop: "20px", textAlign: "right" }}>
        <button onClick={handleGoList} style={styles.goListButton}>
          구매 리스트 보기
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "700px",
    margin: "40px auto",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  submitButton: {
    marginTop: "12px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    cursor: "pointer",
    borderRadius: "4px",
  },
  goListButton: {
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default BuyerHomePage;
