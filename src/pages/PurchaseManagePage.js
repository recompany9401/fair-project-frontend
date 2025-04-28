import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PurchaseManagePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faFilter } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from "xlsx";

function PurchaseManagePage() {
  const navigate = useNavigate();

  const [searchField, setSearchField] = useState("buyerName");
  const [searchKeyword, setSearchKeyword] = useState("");

  const [purchases, setPurchases] = useState([]);

  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      let url =
        "https://fair-project-backend-production.up.railway.app/api/admin/purchases";

      if (searchKeyword) {
        url += `?field=${encodeURIComponent(
          searchField
        )}&keyword=${encodeURIComponent(searchKeyword)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setPurchases(data);
      } else {
        console.error("구매 내역 조회 실패:", data.message);
      }
    } catch (err) {
      console.error("구매 내역 요청 오류:", err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPurchases();
  };

  const handleRowClick = (purchaseId) => {
    navigate(`/admin/purchase-detail/${purchaseId}`);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const translateStatus = (status) => {
    if (!status) return "";
    if (status === "CONFIRMED") return "확정";
    if (status === "CANCELED") return "취소";
    if (status === "PENDING") return "미확정";
    return status;
  };

  const getSortedPurchases = () => {
    const sorted = [...purchases];
    if (!sortField) return sorted;

    sorted.sort((a, b) => {
      if (sortField === "contractDate") {
        const dateA = a.contractDate ? new Date(a.contractDate).getTime() : 0;
        const dateB = b.contractDate ? new Date(b.contractDate).getTime() : 0;
        if (dateA === dateB) return 0;
        return dateA < dateB
          ? sortOrder === "asc"
            ? -1
            : 1
          : sortOrder === "asc"
          ? 1
          : -1;
      } else {
        let valA = a[sortField] || "";
        let valB = b[sortField] || "";
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
        if (valA === valB) return 0;
        return valA < valB
          ? sortOrder === "asc"
            ? -1
            : 1
          : sortOrder === "asc"
          ? 1
          : -1;
      }
    });

    return sorted;
  };

  const sortedPurchases = getSortedPurchases();

  const renderIconOrArrow = (field) => {
    if (sortField === field) {
      return <span>{sortOrder === "asc" ? "▲" : "▼"}</span>;
    }
    return <FontAwesomeIcon icon={faFilter} />;
  };

  const handleDownloadExcel = () => {
    try {
      const excelData = sortedPurchases.map((item, idx) => {
        return {
          No: idx + 1,
          구매자명: item.buyerName,
          동호수: item.dongHo,
          회사명: item.businessName,
          품목: item.itemCategory,
          상품명: item.productName,
          옵션: item.option,
          판매금액: item.finalPrice,
          계약금: item.deposit,
          계약일자: item.contractDate
            ? new Date(item.contractDate).toLocaleDateString()
            : "",
          상태: translateStatus(item.status),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(excelData, {
        skipHeader: false,
      });
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseList");

      XLSX.writeFile(workbook, "구매내역.xlsx");
    } catch (err) {
      console.error("Excel 다운로드 오류:", err);
    }
  };

  return (
    <div className="ManagePage">
      <div className="detail-header">
        <img src="/images/logo-white.png" alt="logo" />
        <h2>구매 내역 관리</h2>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <div className="select-wrapper">
          <select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="buyerName">구매자명</option>
            <option value="businessName">회사명</option>
            <option value="itemCategory">품목</option>
            <option value="productName">상품명</option>
            <option value="option">옵션</option>
          </select>
        </div>

        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
          />
        </div>

        <button type="submit" className="search-btn">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </form>

      <div className="excel">
        <button onClick={handleDownloadExcel} className="excel-btn">
          Excel 다운로드
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>No</th>
            <th onClick={() => handleSort("buyerName")}>
              구매자명 {renderIconOrArrow("buyerName")}
            </th>
            <th onClick={() => handleSort("dongHo")}>
              동/호수 {renderIconOrArrow("dongHo")}
            </th>
            <th onClick={() => handleSort("businessName")}>
              회사명 {renderIconOrArrow("businessName")}
            </th>
            <th>품목</th>
            <th>상품명</th>
            <th>옵션</th>
            <th>판매금액</th>
            <th>계약금</th>
            <th onClick={() => handleSort("contractDate")}>
              계약일자 {renderIconOrArrow("contractDate")}
            </th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {sortedPurchases.map((p, idx) => (
            <tr key={p._id} onClick={() => handleRowClick(p._id)}>
              <td>{idx + 1}</td>
              <td>{p.buyerName || "??"}</td>
              <td>{p.dongHo || ""}</td>
              <td>{p.businessName || ""}</td>
              <td>{p.itemCategory}</td>
              <td>{p.productName}</td>
              <td>{p.option}</td>
              <td>{p.finalPrice}</td>
              <td>{p.deposit}</td>
              <td>
                {p.contractDate
                  ? new Date(p.contractDate).toLocaleDateString()
                  : ""}
              </td>
              <td>{translateStatus(p.status)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PurchaseManagePage;
