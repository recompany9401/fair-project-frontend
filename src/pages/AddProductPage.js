import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddProductPage.css";

function AddProductPage() {
  const navigate = useNavigate();

  const storedBusinessId = localStorage.getItem("businessId");
  const storedBusinessName = localStorage.getItem("businessName");

  const [formData, setFormData] = useState({
    itemCategory: "",
    productName: "",
    option: "",
    price: "",
  });

  const [message] = useState("");

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
  }, [storedBusinessId, storedBusinessName, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
          <input
            type="text"
            name="itemCategory"
            value={formData.itemCategory}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>상품명</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            required
          />
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
      {message && <p>{message}</p>}
    </div>
  );
}

export default AddProductPage;
