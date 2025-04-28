import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BusinessEditPage.css";

function BusinessEditPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [businessId, setBusinessId] = useState("");

  useEffect(() => {
    const storedBizId = localStorage.getItem("businessId");
    if (!storedBizId) {
      alert("사업자 정보가 없습니다. 로그인 해주세요.");
      navigate("/");
      return;
    }
    setBusinessId(storedBizId);
    fetchAllProducts(storedBizId);
  }, [navigate]);

  const fetchAllProducts = async (bizId) => {
    try {
      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/products?businessId=${bizId}`
      );
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      } else {
        console.error("상품 목록 조회 실패:", data.message);
      }
    } catch (err) {
      console.error("상품 목록 요청 오류:", err);
    }
  };

  const handleChange = (index, field, value) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSaveAll = async () => {
    if (!window.confirm("모든 수정 내용을 저장하시겠습니까? (5~10초 소요)"))
      return;

    try {
      for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const res = await fetch(
          `https://fair-project-backend-production.up.railway.app/api/products/${p._id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              itemCategory: p.itemCategory,
              productName: p.productName,
              option: p.option,
              price: Number(p.price),
            }),
          }
        );
        if (!res.ok) {
          const data = await res.json();
          alert(`수정 실패: ${data.message}`);
          return;
        }
      }
      alert("모든 수정 사항이 저장되었습니다.");
      fetchAllProducts(businessId);
    } catch (err) {
      console.error("수정 오류:", err);
      alert("서버 오류");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("삭제하시겠습니까?")) return;
    try {
      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/products/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (res.ok) {
        alert("삭제 완료");
        setProducts((prev) => prev.filter((x) => x._id !== id));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("서버 오류");
    }
  };

  return (
    <div className="business-homepage">
      <div className="business-header">
        <img src="/images/logo-side.png" alt="logo" />
        <h2>품목 수정/삭제</h2>
      </div>

      <table className="edit-table">
        <thead>
          <tr>
            <th>카테고리</th>
            <th>상품명</th>
            <th>옵션</th>
            <th>가격</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, index) => (
            <tr key={prod._id}>
              <td>
                <input
                  type="text"
                  value={prod.itemCategory}
                  onChange={(e) =>
                    handleChange(index, "itemCategory", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={prod.productName}
                  onChange={(e) =>
                    handleChange(index, "productName", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="text"
                  value={prod.option}
                  onChange={(e) =>
                    handleChange(index, "option", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={prod.price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                />
              </td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(prod._id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="save-container">
        <button className="save-button" onClick={handleSaveAll}>
          저장
        </button>
      </div>
    </div>
  );
}

export default BusinessEditPage;
