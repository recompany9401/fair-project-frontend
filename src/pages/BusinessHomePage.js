// src/pages/BusinessHomePage.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function BusinessHomePage() {
  const navigate = useNavigate();

  // (A) 검색어, 상품 목록, 그룹화된 데이터
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [groupedData, setGroupedData] = useState({});

  // (B) 사업자 정보 (로그인 시 localStorage에 저장)
  const [businessId, setBusinessId] = useState("");
  const [businessName, setBusinessName] = useState("내 회사(상호명)");

  // 드롭다운(아코디언) 토글 상태
  const [categoryOpen, setCategoryOpen] = useState({});
  const [productOpen, setProductOpen] = useState({});

  // 컴포넌트 마운트 시(처음)
  useEffect(() => {
    // 1) localStorage에서 businessId, businessName 가져오기
    const storedBizId = localStorage.getItem("businessId");
    const storedBizName = localStorage.getItem("businessName");
    if (!storedBizId) {
      // businessId 없으면 로그인 페이지로
      alert("사업자 정보가 없습니다. 로그인 해주세요.");
      navigate("/");
      return;
    }
    setBusinessId(storedBizId);
    if (storedBizName) {
      setBusinessName(storedBizName);
    }

    // 2) 처음 로드 시 상품 목록 불러오기
    fetchProducts("", storedBizId);
  }, [navigate]);

  // (1) 상품 목록 + 검색
  const fetchProducts = async (search, bizId) => {
    try {
      // businessId와 (검색 용) searchTerm을 쿼리에 포함
      const query = search
        ? `?businessId=${bizId}&search=${encodeURIComponent(search)}`
        : `?businessId=${bizId}`;

      const response = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/products${query}`
      );
      const data = await response.json();

      if (response.ok) {
        setProducts(data);
        groupProductsByCategory(data);
      } else {
        console.log("상품 조회 오류:", data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // (2) 품목(itemCategory) → 상품명(productName) → 옵션(option) 형태로 그룹화
  //    push로 옵션들을 "배열에 누적" → 마지막 옵션도 표시
  const groupProductsByCategory = (items) => {
    const grouped = {};

    items.forEach((prod) => {
      const category = prod.itemCategory;
      const pName = prod.productName;
      const opt = prod.option || ""; // 옵션이 없으면 빈문자열

      // 없으면 생성
      if (!grouped[category]) {
        grouped[category] = {};
      }
      if (!grouped[category][pName]) {
        grouped[category][pName] = [];
      }

      // 배열에 누적(push)
      grouped[category][pName].push(opt);
    });

    setGroupedData(grouped);
  };

  // (3) 검색 폼 submit
  const handleSearch = (e) => {
    e.preventDefault();
    if (!businessId) return;
    fetchProducts(searchTerm, businessId);
  };

  // (4) 드롭다운(아코디언) 토글
  const toggleCategory = (category) => {
    setCategoryOpen((prev) => ({ ...prev, [category]: !prev[category] }));
  };
  const toggleProduct = (category, productName) => {
    const key = `${category}-${productName}`;
    setProductOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // (5) 품목 추가 버튼
  const handleAddProduct = () => {
    navigate("/business/add-product");
  };

  const handleOptionClick = (category, pName, opt) => {
    const bizId = localStorage.getItem("businessId");
    navigate(
      `/business/option-detail?businessId=${bizId}&itemCategory=${encodeURIComponent(
        category
      )}&productName=${encodeURIComponent(pName)}&option=${encodeURIComponent(
        opt
      )}`
    );
  };

  return (
    <div style={styles.container}>
      <h2>{businessName} - 사업자 전용 페이지</h2>

      {/* 검색 바 */}
      <form onSubmit={handleSearch} style={styles.searchBox}>
        <input
          type="text"
          placeholder="상품명 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>
          검색
        </button>
      </form>

      {/* 상품 목록 (드롭다운 구조) */}
      <div style={styles.listContainer}>
        {Object.keys(groupedData).length === 0 ? (
          <p>등록된 상품이 없습니다.</p>
        ) : (
          Object.entries(groupedData).map(([category, productMap]) => (
            <div key={category} style={styles.categoryBlock}>
              <div
                style={styles.categoryHeader}
                onClick={() => toggleCategory(category)}
              >
                <strong>{category}</strong>
                <span style={{ marginLeft: "8px" }}>
                  {categoryOpen[category] ? "▲" : "▼"}
                </span>
              </div>
              {categoryOpen[category] &&
                Object.entries(productMap).map(([pName, options]) => {
                  const productKey = `${category}-${pName}`;
                  return (
                    <div key={pName} style={styles.productBlock}>
                      <div
                        style={styles.productHeader}
                        onClick={() => toggleProduct(category, pName)}
                      >
                        └ {pName}
                        <span style={{ marginLeft: "8px" }}>
                          {productOpen[productKey] ? "▲" : "▼"}
                        </span>
                      </div>
                      {productOpen[productKey] &&
                        options.map((opt, idx) => (
                          <div
                            key={idx}
                            style={styles.optionBlock}
                            onClick={() =>
                              handleOptionClick(category, pName, opt)
                            }
                          >
                            &nbsp;&nbsp;&nbsp;└ {opt}
                          </div>
                        ))}
                    </div>
                  );
                })}
            </div>
          ))
        )}
      </div>

      {/* 추가 버튼 */}
      <button style={styles.addButton} onClick={handleAddProduct}>
        품목 추가
      </button>
    </div>
  );
}

// 간단한 스타일
const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  searchBox: {
    display: "flex",
    marginBottom: "16px",
  },
  searchInput: {
    flex: 1,
    padding: "8px",
    fontSize: "14px",
  },
  searchButton: {
    padding: "8px 16px",
  },
  listContainer: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "12px",
  },
  categoryBlock: {
    marginBottom: "8px",
  },
  categoryHeader: {
    backgroundColor: "#eee",
    padding: "6px",
    cursor: "pointer",
  },
  productBlock: {
    marginLeft: "16px",
  },
  productHeader: {
    cursor: "pointer",
    margin: "4px 0",
  },
  optionBlock: {
    marginLeft: "16px",
    fontSize: "14px",
  },
  addButton: {
    marginTop: "16px",
    padding: "8px 16px",
    backgroundColor: "#2196F3",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default BusinessHomePage;
