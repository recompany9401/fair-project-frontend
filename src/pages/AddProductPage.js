import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddProductPage.css";

function AddProductPage() {
  const navigate = useNavigate();

  const storedBusinessId = localStorage.getItem("businessId");
  const storedBusinessName = localStorage.getItem("businessName");

  const [allCategories, setAllCategories] = useState([]);
  const [catProductMap, setCatProductMap] = useState({});

  const [useExistingCategory, setUseExistingCategory] = useState(true);
  const [useExistingProductName, setUseExistingProductName] = useState(true);

  const [formData, setFormData] = useState({
    businessName: "",
    itemCategory: "",
    productName: "",
    option: "",
    price: "",
  });

  useEffect(() => {
    if (!storedBusinessId || !storedBusinessName) {
      alert("로그인된 사업자 정보가 없습니다. 로그인 페이지로 이동합니다.");
      navigate("/");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      businessName: storedBusinessName,
    }));

    fetchMyBusinessProducts(storedBusinessId);
  }, [storedBusinessId, storedBusinessName, navigate]);

  const fetchMyBusinessProducts = async (bizId) => {
    try {
      const url = `https://fair-project-backend-production.up.railway.app/api/products?businessId=${bizId}`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        const catMap = {};
        data.forEach((prod) => {
          const cat = prod.itemCategory;
          const pName = prod.productName;
          if (!catMap[cat]) {
            catMap[cat] = new Set();
          }
          catMap[cat].add(pName);
        });

        const sortedCatMap = {};
        const catArr = Object.keys(catMap).sort((a, b) => a.localeCompare(b));
        catArr.forEach((cat) => {
          const prodArr = Array.from(catMap[cat]).sort((a, b) =>
            a.localeCompare(b)
          );
          sortedCatMap[cat] = prodArr;
        });

        setCatProductMap(sortedCatMap);
        setAllCategories(catArr);
      } else {
        console.error("상품 전체 조회 실패:", data.message);
      }
    } catch (err) {
      console.error("fetchAllProducts 오류:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (e) => {
    const val = e.target.value;
    if (val === "__CUSTOM__") {
      setUseExistingCategory(false);
      setFormData((prev) => ({ ...prev, itemCategory: "" }));
    } else {
      setUseExistingCategory(true);
      setFormData((prev) => ({ ...prev, itemCategory: val, productName: "" }));
      setUseExistingProductName(true);
    }
  };

  const handleProductSelect = (e) => {
    const val = e.target.value;
    if (val === "__CUSTOM__") {
      setUseExistingProductName(false);
      setFormData((prev) => ({ ...prev, productName: "" }));
    } else {
      setUseExistingProductName(true);
      setFormData((prev) => ({ ...prev, productName: val }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { itemCategory, productName, option, price, businessName } =
        formData;
      if (
        !itemCategory ||
        !productName ||
        !businessName ||
        !storedBusinessId ||
        price === ""
      ) {
        alert("필수 입력 항목이 누락되었습니다.");
        return;
      }

      const bodyData = {
        businessId: storedBusinessId,
        businessName,
        itemCategory,
        productName,
        option,
        price: Number(price),
      };

      const response = await fetch(
        "https://fair-project-backend-production.up.railway.app/api/products",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyData),
        }
      );
      const data = await response.json();

      if (response.ok) {
        alert("상품 등록이 완료되었습니다.");
        navigate("/business-home");
      } else {
        alert(`${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("서버 오류 발생");
    }
  };

  return (
    <div className="add-product">
      <img src="/images/logo-side.png" alt="logo" />
      <h2>품목 추가</h2>
      <form onSubmit={handleSubmit} className="add-form">
        <div>
          <label>업체명</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName || ""}
            onChange={handleChange}
            readOnly
            style={{ backgroundColor: "#f0f0f0" }}
          />
        </div>

        <div>
          <label>품목</label>
          <div className="select-input-group">
            {allCategories.length > 0 ? (
              <>
                <select
                  value={
                    useExistingCategory ? formData.itemCategory : "__CUSTOM__"
                  }
                  onChange={handleCategorySelect}
                >
                  <option value="">카테고리 선택</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="__CUSTOM__">직접 입력하기</option>
                </select>

                {!useExistingCategory && (
                  <div className="custom-input-wrapper">
                    <input
                      type="text"
                      name="itemCategory"
                      value={formData.itemCategory}
                      onChange={handleChange}
                      placeholder="새 품목 입력"
                    />
                  </div>
                )}
              </>
            ) : (
              <input
                type="text"
                name="itemCategory"
                value={formData.itemCategory}
                onChange={handleChange}
                required
              />
            )}
          </div>
        </div>

        <div>
          <label>상품명</label>
          <div className="select-input-group">
            {useExistingCategory &&
            formData.itemCategory &&
            catProductMap[formData.itemCategory] ? (
              <>
                <select
                  value={
                    useExistingProductName ? formData.productName : "__CUSTOM__"
                  }
                  onChange={handleProductSelect}
                >
                  <option value="">상품명 선택</option>
                  {catProductMap[formData.itemCategory].map((pName) => (
                    <option key={pName} value={pName}>
                      {pName}
                    </option>
                  ))}
                  <option value="__CUSTOM__">직접 입력하기</option>
                </select>

                {!useExistingProductName && (
                  <div className="custom-input-wrapper">
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder="새 상품명 입력"
                    />
                  </div>
                )}
              </>
            ) : (
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                required
              />
            )}
          </div>
        </div>

        <div>
          <label>옵션</label>
          <input
            type="text"
            name="option"
            value={formData.option}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>판매금액</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">등록하기</button>
      </form>
    </div>
  );
}

export default AddProductPage;
