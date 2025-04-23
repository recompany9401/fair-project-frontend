import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

  const [message, setMessage] = useState("");

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
    setMessage("등록 중...");

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
        setMessage("필수 필드가 누락되었습니다.");
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
        setMessage("상품 등록 성공!");
        navigate("/business-home");
      } else {
        setMessage(`오류: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("서버 오류 발생");
    }
  };

  return (
    <div style={styles.container}>
      <h2>품목(판매품) 추가</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>업체명(businessName)</label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName || ""}
          onChange={handleChange}
          readOnly
          style={{ backgroundColor: "#f0f0f0" }}
        />

        <label>품목(itemCategory)</label>
        <input
          type="text"
          name="itemCategory"
          value={formData.itemCategory}
          onChange={handleChange}
          required
        />

        <label>상품명(productName)</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
          required
        />

        <label>옵션(option)</label>
        <input
          type="text"
          name="option"
          value={formData.option || ""}
          onChange={handleChange}
        />

        <label>판매금액(price)</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <button type="submit" style={styles.submitButton}>
          등록하기
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    width: "400px",
    margin: "30px auto",
    textAlign: "left",
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
};

export default AddProductPage;
