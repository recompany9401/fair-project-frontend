import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/BuyerPurchaseDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faRectangleList,
} from "@fortawesome/free-solid-svg-icons";

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
        alert("상세조회 실패 " + data.message);
      }
    } catch (err) {
      console.error("구매 상세 오류:", err);
      alert("서버 오류");
    }
  };

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
        alert("수정이 완료되었습니다.");
        navigate("/buyer-purchase-list");
      } else {
        alert("수정 실패: " + data.message);
      }
    } catch (err) {
      console.error("구매내역 수정 오류:", err);
      alert("서버 오류");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) {
      return;
    }

    try {
      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/purchases/${purchaseId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (res.ok) {
        alert("삭제가 완료되었습니다.");
        navigate("/buyer-purchase-list");
      } else {
        alert("삭제 실패: " + data.message);
      }
    } catch (err) {
      console.error("구매내역 삭제 오류:", err);
      alert("서버 오류가 발생했습니다.");
    }
  };

  const handleGoHome = () => {
    navigate("/buyer-home");
  };

  return (
    <div className="purchase-detail">
      <div className="top-banner">
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

      <div className="table-wrap">
        <div>
          <label>품목</label>
          <input
            type="text"
            name="itemCategory"
            value={formData.itemCategory}
            readOnly
          />
        </div>
        <div>
          <label>업체명</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            readOnly
          />
        </div>
        <div>
          <label>상품명</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            readOnly
          />
        </div>
        <div>
          <label>옵션</label>
          <input type="text" name="option" value={formData.option} readOnly />
        </div>
        <div>
          <label>판매가</label>
          <input type="number" name="price" value={formData.price} readOnly />
        </div>
        <div>
          <label>할인/할증</label>
          <input
            type="number"
            name="discountOrSurcharge"
            value={formData.discountOrSurcharge}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>최종금액</label>
          <input
            type="number"
            name="finalPrice"
            value={formData.finalPrice}
            readOnly
          />
        </div>
        <div>
          <label>계약금</label>
          <input
            type="number"
            name="deposit"
            value={formData.deposit}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>계약일자</label>
          <input
            type="date"
            name="contractDate"
            value={formData.contractDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>설치예정일</label>
          <input
            type="date"
            name="installationDate"
            value={formData.installationDate}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>비고</label>
          <textarea
            rows="3"
            name="note"
            value={formData.note}
            onChange={handleChange}
          />
        </div>
      </div>

      <div>
        <button onClick={handleSave} className="save-btn">
          저장
        </button>
        <button onClick={handleDelete} className="del-btn">
          삭제
        </button>
      </div>
    </div>
  );
}

export default BuyerPurchaseDetail;
