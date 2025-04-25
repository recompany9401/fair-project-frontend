import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * 전체 품목/상품/옵션을 테이블로 표시
 * - 각 행: { itemCategory, productName, option, price }
 * - 인풋으로 바로 값 수정 가능
 * - 하단 "저장" 버튼 -> 전체 변경사항 PATCH
 * - 각 행의 "삭제" 버튼 -> confirm 후 DELETE
 */
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

    // 전체 품목 불러오기
    fetchAllProducts(storedBizId);
  }, [navigate]);

  // 상품 목록 조회
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

  // 각 행을 수정할 수 있도록, products 배열 자체를 state로 사용
  // 인풋 변경 시 해당 row의 값 업데이트
  const handleChange = (index, field, value) => {
    setProducts((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // 저장 (하단 버튼) -> 수정된 행들 모두 PATCH 요청
  // 단순화를 위해, 모든 행에 대해 PATCH. 실제론 변경된 행만 보낼 수도 있음
  const handleSaveAll = async () => {
    if (!window.confirm("모든 수정 내용을 저장하시겠습니까? (5~10초 소요)"))
      return;

    try {
      for (let i = 0; i < products.length; i++) {
        const p = products[i];
        // PATCH /api/products/:id
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
        // 개별 응답 처리(에러 등)
        if (!res.ok) {
          const data = await res.json();
          alert(`수정 실패: ${data.message}`);
          return; // 중단 or 계속?
        }
      }

      alert("모든 수정 사항이 저장되었습니다.");
      fetchAllProducts(businessId); // 재로드 (옵션)
    } catch (err) {
      console.error("수정 오류:", err);
      alert("서버 오류");
    }
  };

  // 행 삭제 -> confirm 후 DELETE
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
        // products state에서 해당 행 제거
        setProducts((prev) => prev.filter((x) => x._id !== id));
      } else {
        alert(data.message); // 구매 데이터 존재?
      }
    } catch (err) {
      console.error("삭제 오류:", err);
      alert("서버 오류");
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h2>전체 품목 / 상품 / 옵션 수정</h2>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#eee" }}>
            <th style={thStyle}>카테고리</th>
            <th style={thStyle}>상품명</th>
            <th style={thStyle}>옵션</th>
            <th style={thStyle}>가격</th>
            <th style={thStyle}>액션</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod, index) => (
            <tr key={prod._id}>
              <td style={tdStyle}>
                <input
                  type="text"
                  value={prod.itemCategory}
                  onChange={(e) =>
                    handleChange(index, "itemCategory", e.target.value)
                  }
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="text"
                  value={prod.productName}
                  onChange={(e) =>
                    handleChange(index, "productName", e.target.value)
                  }
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="text"
                  value={prod.option}
                  onChange={(e) =>
                    handleChange(index, "option", e.target.value)
                  }
                />
              </td>
              <td style={tdStyle}>
                <input
                  type="number"
                  value={prod.price}
                  onChange={(e) => handleChange(index, "price", e.target.value)}
                />
              </td>
              <td style={tdStyle}>
                <button onClick={() => handleDelete(prod._id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 하단에 "저장" 버튼 */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button
          style={{
            padding: "0.6rem 1rem",
            backgroundColor: "#7d1616",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
          onClick={handleSaveAll}
        >
          저장
        </button>
      </div>
    </div>
  );
}

// 간단한 스타일
const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  textAlign: "center",
};
const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};

export default BusinessEditPage;
