import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/BusinessHomePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function BusinessHomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [businessId, setBusinessId] = useState("");
  const [businessName, setBusinessName] = useState("내 회사(상호명)");

  const [categoryOpen, setCategoryOpen] = useState({});
  const [productOpen, setProductOpen] = useState({});

  useEffect(() => {
    const storedBizId = localStorage.getItem("businessId");
    const storedBizName = localStorage.getItem("businessName");
    if (!storedBizId) {
      alert("사업자 정보가 없습니다. 로그인 해주세요.");
      navigate("/");
      return;
    }
    setBusinessId(storedBizId);
    if (storedBizName) {
      setBusinessName(storedBizName);
    }
    fetchProducts("", storedBizId);
  }, [navigate]);

  const fetchProducts = async (search, bizId) => {
    try {
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

  const groupProductsByCategory = (items) => {
    const grouped = {};

    items.forEach((prod) => {
      const category = prod.itemCategory;
      const pName = prod.productName;
      const opt = prod.option || "";

      if (!grouped[category]) grouped[category] = {};
      if (!grouped[category][pName]) grouped[category][pName] = [];
      grouped[category][pName].push(opt);
    });

    setGroupedData(grouped);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!businessId) return;
    fetchProducts(searchTerm, businessId);
  };

  const toggleCategory = (category) => {
    setCategoryOpen((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const toggleProduct = (category, productName) => {
    const key = `${category}-${productName}`;
    setProductOpen((prev) => ({ ...prev, [key]: !prev[key] }));
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

  const handleAddProduct = () => {
    navigate("/business/add-product");
  };

  return (
    <div className="business-homepage">
      <div className="business-header">
        <img src="/images/logo-side.png" alt="logo" />
        <h2>
          <span>{businessName}</span>
        </h2>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="품명을 입력해 주세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>

      <div className="category-list">
        {Object.keys(groupedData).length === 0 ? (
          <p>등록된 상품이 없습니다.</p>
        ) : (
          Object.entries(groupedData).map(([category, productMap]) => (
            <div key={category}>
              <div
                className="category-item"
                onClick={() => toggleCategory(category)}
              >
                <span>{category}</span>
                <span className="arrow">
                  {categoryOpen[category] ? "▲" : "▼"}
                </span>
              </div>
              {categoryOpen[category] &&
                Object.entries(productMap).map(([pName, options]) => {
                  const productKey = `${category}-${pName}`;
                  return (
                    <div key={pName}>
                      <div
                        className="product-item"
                        onClick={() => toggleProduct(category, pName)}
                      >
                        <span>└ {pName}</span>
                        <span className="arrow">
                          {productOpen[productKey] ? "▲" : "▼"}
                        </span>
                      </div>
                      {productOpen[productKey] &&
                        options.map((opt, idx) => (
                          <div
                            key={idx}
                            className="option-item"
                            onClick={() =>
                              handleOptionClick(category, pName, opt)
                            }
                          >
                            └ {opt}
                          </div>
                        ))}
                    </div>
                  );
                })}
            </div>
          ))
        )}
      </div>

      <button className="add-button" onClick={handleAddProduct}>
        품목 추가
      </button>
    </div>
  );
}

export default BusinessHomePage;
