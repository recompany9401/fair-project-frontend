// src/pages/BuyerPurchaseDetail.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function BuyerPurchaseDetail() {
  const { purchaseId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    itemCategory: "",
    businessName: "",
    productName: "",
    option: "",
    price: 0,
    discountOrSurcharge: 0,
    finalPrice: 0,
    deposit: 0,
    contractDate: "",
    installationDate: "",
    note: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchPurchaseDetail();
  }, [purchaseId]);

  const fetchPurchaseDetail = async () => {
    try {
      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/purchases/${purchaseId}`
      );
      const data = await res.json();
      if (res.ok) {
        setFormData({
          itemCategory: data.itemCategory,
          businessName: data.businessName,
          productName: data.productName,
          option: data.option,
          price: data.price,
          discountOrSurcharge: data.discountOrSurcharge,
          finalPrice: data.finalPrice,
          deposit: data.deposit,
          contractDate: data.contractDate
            ? data.contractDate.substring(0, 10)
            : "",
          installationDate: data.installationDate
            ? data.installationDate.substring(0, 10)
            : "",
          note: data.note || "",
        });
      } else {
        setMessage("상세조회 실패: " + data.message);
      }
    } catch (err) {
      console.error("구매 상세 오류:", err);
      setMessage("서버 오류");
    }
  };

  // 할인/할증, price가 바뀌면 finalPrice 재계산(프론트)
  useEffect(() => {
    const p = Number(formData.price) || 0;
    const d = Number(formData.discountOrSurcharge) || 0;
    setFormData((prev) => ({
      ...prev,
      finalPrice: p - d,
    }));
  }, [formData.price, formData.discountOrSurcharge]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setMessage("저장 중...");
    try {
      const updateData = {
        itemCategory: formData.itemCategory,
        businessName: formData.businessName,
        productName: formData.productName,
        option: formData.option,
        price: Number(formData.price),
        discountOrSurcharge: Number(formData.discountOrSurcharge),
        finalPrice: Number(formData.finalPrice),
        deposit: Number(formData.deposit),
        contractDate: formData.contractDate || null,
        installationDate: formData.installationDate || null,
        note: formData.note,
      };

      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/purchases/${purchaseId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updateData),
        }
      );
      const data = await res.json();

      if (res.ok) {
        setMessage("수정 성공!");
        // 수정 후 목록 페이지로 이동
        navigate("/buyer-purchase-list");
      } else {
        setMessage("수정 실패: " + data.message);
      }
    } catch (err) {
      console.error("구매내역 수정 오류:", err);
      setMessage("서버 오류");
    }
  };

  return (
    <div style={styles.container}>
      <h2>구매 상세</h2>
      {message && <p>{message}</p>}

      <div style={styles.field}>
        <label>품목</label>
        <input
          type="text"
          name="itemCategory"
          value={formData.itemCategory}
          onChange={handleChange}
        />
      </div>
      <div style={styles.field}>
        <label>업체명</label>
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
        />
      </div>
      <div style={styles.field}>
        <label>상품명</label>
        <input
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
        />
      </div>
      <div style={styles.field}>
        <label>옵션</label>
        <input
          type="text"
          name="option"
          value={formData.option}
          onChange={handleChange}
        />
      </div>
      <div style={styles.field}>
        <label>판매가</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
        />
      </div>
      <div style={styles.field}>
        <label>할인/할증</label>
        <input
          type="number"
          name="discountOrSurcharge"
          value={formData.discountOrSurcharge}
          onChange={handleChange}
        />
      </div>
      <div style={styles.field}>
        <label>최종금액</label>
        <input
          type="number"
          name="finalPrice"
          value={formData.finalPrice}
          readOnly
        />
      </div>
      <div style={styles.field}>
        <label>계약금</label>
        <input
          type="number"
          name="deposit"
          value={formData.deposit}
          onChange={handleChange}
        />
      </div>
      <div style={styles.field}>
        <label>계약일자</label>
        <input
          type="date"
          name="contractDate"
          value={formData.contractDate}
          onChange={handleChange}
        />
      </div>
      <div style={styles.field}>
        <label>설치예정일</label>
        <input
          type="date"
          name="installationDate"
          value={formData.installationDate}
          onChange={handleChange}
        />
      </div>
      <div style={styles.field}>
        <label>비고</label>
        <textarea
          rows="3"
          name="note"
          value={formData.note}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSave} style={styles.saveButton}>
        저장
      </button>
    </div>
  );
}

const styles = {
  container: {
    width: "600px",
    margin: "20px auto",
  },
  field: {
    marginBottom: "8px",
  },
  saveButton: {
    marginTop: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: "4px",
  },
};

export default BuyerPurchaseDetail;
