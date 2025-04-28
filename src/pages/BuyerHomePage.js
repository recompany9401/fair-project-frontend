import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BuyerHomePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faRectangleList,
  faCircleUser,
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

  const [depositMode, setDepositMode] = useState("select");
  const [depositPercent, setDepositPercent] = useState("");
  const [deposit, setDeposit] = useState(0);

  const [middleMode, setMiddleMode] = useState("select");
  const [middlePercent, setMiddlePercent] = useState("");
  const [middlePayment, setMiddlePayment] = useState(0);

  const [finalMode, setFinalMode] = useState("select");
  const [finalPercent, setFinalPercent] = useState("");
  const [finalPayment, setFinalPaymentValue] = useState(0);

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

  const paymentOptions = [
    "10",
    "20",
    "30",
    "40",
    "50",
    "60",
    "70",
    "80",
    "90",
    "100",
    "__CUSTOM__",
  ];

  useEffect(() => {
    if (depositMode === "select") {
      if (depositPercent && depositPercent !== "__CUSTOM__") {
        const val = Number(depositPercent);
        const computed = Math.floor((finalPrice * val) / 100);
        setDeposit(computed);
      } else {
        setDeposit(0);
      }
    }
  }, [depositMode, depositPercent, finalPrice]);

  useEffect(() => {
    if (middleMode === "select") {
      if (middlePercent && middlePercent !== "__CUSTOM__") {
        const val = Number(middlePercent);
        const computed = Math.floor((finalPrice * val) / 100);
        setMiddlePayment(computed);
      } else {
        setMiddlePayment(0);
      }
    }
  }, [middleMode, middlePercent, finalPrice]);

  useEffect(() => {
    if (finalMode === "select") {
      if (finalPercent && finalPercent !== "__CUSTOM__") {
        const val = Number(finalPercent);
        const computed = Math.floor((finalPrice * val) / 100);
        setFinalPaymentValue(computed);
      } else {
        setFinalPaymentValue(0);
      }
    }
  }, [finalMode, finalPercent, finalPrice]);

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
      middlePayment: Number(middlePayment),
      finalPayment: Number(finalPayment),
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

    setDepositMode("select");
    setDepositPercent("");
    setDeposit(0);

    setMiddleMode("select");
    setMiddlePercent("");
    setMiddlePayment(0);

    setFinalMode("select");
    setFinalPercent("");
    setFinalPaymentValue(0);

    setContractDate("");
    setInstallationDate("");
    setNote("");
  };

  const handleGoList = () => {
    navigate("/buyer-purchase-list");
  };

  const handleGoUser = () => {
    navigate("/buyer-info");
  };

  return (
    <div className="buyer-page">
      <div className="top-banner">
        <button className="user-btn" onClick={handleGoUser}>
          <FontAwesomeIcon icon={faCircleUser} />
        </button>
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
            {categories.map((cat) => (
              <option key={cat} value={cat}>
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
            {businessList.map((biz) => (
              <option key={biz} value={biz}>
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
            {productList.map((prod) => (
              <option key={prod} value={prod}>
                {prod}
              </option>
            ))}
          </select>
          <div />
        </div>

        <div>
          <label>옵션</label>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            required
          >
            <option value="">선택</option>
            {optionList.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div />
        </div>

        <div>
          <label>판매가</label>
          <input type="number" value={price} readOnly />
          <div />
        </div>

        <div>
          <label>할인/할증</label>
          <div>
            <input
              type="number"
              value={discountOrSurcharge}
              onChange={(e) => setDiscountOrSurcharge(e.target.value)}
            />
            <div />
          </div>
        </div>

        <div>
          <label>최종금액</label>
          <input type="number" value={finalPrice} readOnly />
          <div />
        </div>

        <div>
          <label>계약금</label>
          <div className="price-select">
            {depositMode === "select" ? (
              <select
                value={depositPercent}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "__CUSTOM__") {
                    setDepositMode("custom");
                    setDepositPercent("__CUSTOM__");
                  } else {
                    setDepositPercent(val);
                  }
                }}
              >
                <option value="">계약금 선택</option>
                {paymentOptions.map((pct) => (
                  <option key={pct} value={pct}>
                    {pct === "__CUSTOM__" ? "직접입력" : `${pct}%`}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="계약금 입력"
                />
                <button
                  type="button"
                  className="select-btn"
                  onClick={() => {
                    setDepositMode("select");
                    setDepositPercent("");
                    setDeposit(0);
                  }}
                >
                  선택변경
                </button>
              </>
            )}
            <div>
              <input type="number" value={deposit} readOnly />
            </div>
          </div>
        </div>

        <div>
          <label>중도금</label>
          <div className="price-select">
            {middleMode === "select" ? (
              <select
                value={middlePercent}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "__CUSTOM__") {
                    setMiddleMode("custom");
                    setMiddlePercent("__CUSTOM__");
                  } else {
                    setMiddlePercent(val);
                  }
                }}
              >
                <option value="">중도금 선택</option>
                {paymentOptions.map((pct) => (
                  <option key={pct} value={pct}>
                    {pct === "__CUSTOM__" ? "직접입력" : `${pct}%`}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <input
                  type="number"
                  value={middlePayment}
                  onChange={(e) => setMiddlePayment(e.target.value)}
                  placeholder="중도금 입력"
                />
                <button
                  type="button"
                  className="select-btn"
                  onClick={() => {
                    setMiddleMode("select");
                    setMiddlePercent("");
                    setMiddlePayment(0);
                  }}
                >
                  선택변경
                </button>
              </>
            )}
            <div>
              <input type="number" value={middlePayment} readOnly />
            </div>
          </div>
        </div>

        <div>
          <label>완료금</label>
          <div className="price-select">
            {finalMode === "select" ? (
              <select
                value={finalPercent}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "__CUSTOM__") {
                    setFinalMode("custom");
                    setFinalPercent("__CUSTOM__");
                  } else {
                    setFinalPercent(val);
                  }
                }}
              >
                <option value="">완료금 선택</option>
                {paymentOptions.map((pct) => (
                  <option key={pct} value={pct}>
                    {pct === "__CUSTOM__" ? "직접입력" : `${pct}%`}
                  </option>
                ))}
              </select>
            ) : (
              <>
                <input
                  type="number"
                  value={finalPayment}
                  onChange={(e) => setFinalPaymentValue(e.target.value)}
                  placeholder="완료금 입력"
                />
                <button
                  type="button"
                  className="select-btn"
                  onClick={() => {
                    setFinalMode("select");
                    setFinalPercent("");
                    setFinalPaymentValue(0);
                  }}
                >
                  선택변경
                </button>
              </>
            )}
            <div>
              <input type="number" value={finalPayment} readOnly />
            </div>
          </div>
        </div>

        <div>
          <label>계약일자</label>
          <input
            type="date"
            value={contractDate}
            onChange={(e) => setContractDate(e.target.value)}
            required
          />
          <div />
        </div>

        <div>
          <label>설치예정일</label>
          <input
            type="date"
            value={installationDate}
            onChange={(e) => setInstallationDate(e.target.value)}
          />
          <div />
        </div>

        <div className="boder-none">
          <label>비고</label>
          <textarea
            rows="3"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div />
        </div>

        <button type="submit">구매 정보 등록</button>
      </form>
    </div>
  );
}

export default BuyerHomePage;
