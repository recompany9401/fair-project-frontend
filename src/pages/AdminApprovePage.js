import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/AdminApprovePage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

function AdminApprovePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState("business");

  const [unapprovedBusinesses, setUnapprovedBusinesses] = useState([]);
  const [unapprovedBuyers, setUnapprovedBuyers] = useState([]);

  const [bizSearch, setBizSearch] = useState("");
  const [buyerSearch, setBuyerSearch] = useState("");

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    fetchUnapproved();
  }, []);

  const fetchUnapproved = async () => {
    try {
      const bizRes = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/admin/businesses?approved=false`
      );
      const bizData = await bizRes.json();

      const buyerRes = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/admin/buyers?approved=false`
      );
      const buyerData = await buyerRes.json();

      if (bizRes.ok) {
        setUnapprovedBusinesses(bizData);
      } else {
        console.error("미승인 사업자 조회 실패:", bizData.message);
      }
      if (buyerRes.ok) {
        setUnapprovedBuyers(buyerData);
      } else {
        console.error("미승인 입주자 조회 실패:", buyerData.message);
      }
    } catch (err) {
      console.error("미승인 계정 조회 오류:", err);
    }
  };

  const handleBusinessClick = (businessId) => {
    navigate(`/admin/approve-detail/business/${businessId}`);
  };
  const handleBuyerClick = (buyerId) => {
    navigate(`/admin/approve-detail/buyer/${buyerId}`);
  };

  const handleBizSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/admin/businesses?approved=false&search=${encodeURIComponent(
          bizSearch
        )}`
      );
      const data = await res.json();
      if (res.ok) {
        setUnapprovedBusinesses(data);
      } else {
        console.error("사업자 검색 실패:", data.message);
      }
    } catch (err) {
      console.error("사업자 검색 오류:", err);
    }
  };

  const handleBuyerSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://fair-project-backend-production.up.railway.app/api/admin/buyers?approved=false&search=${encodeURIComponent(
          buyerSearch
        )}`
      );
      const data = await res.json();
      if (res.ok) {
        setUnapprovedBuyers(data);
      } else {
        console.error("입주자 검색 실패:", data.message);
      }
    } catch (err) {
      console.error("입주자 검색 오류:", err);
    }
  };

  return (
    <div className="admin-approve-page">
      <div className="tab-menu">
        <img src="/images/logo-white.png" alt="logo" />
        <div>
          <button
            className={activeTab === "business" ? "active" : ""}
            onClick={() => setActiveTab("business")}
          >
            사업자
          </button>
          <button
            className={activeTab === "buyer" ? "active" : ""}
            onClick={() => setActiveTab("buyer")}
          >
            입주자
          </button>
        </div>
      </div>

      <div className="tab-content">
        {activeTab === "business" && (
          <div className="tab-panel">
            <form className="search-form" onSubmit={handleBizSearch}>
              <input
                type="text"
                placeholder="업체명 / 아이디 검색"
                value={bizSearch}
                onChange={(e) => setBizSearch(e.target.value)}
              />
              <button type="submit">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>

            <table className="approve-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>아이디</th>
                  <th>업체명</th>
                  <th>사업자번호</th>
                </tr>
              </thead>
              <tbody>
                {unapprovedBusinesses.map((b, idx) => (
                  <tr
                    key={b._id}
                    onClick={() => handleBusinessClick(b._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{idx + 1}</td>
                    <td>{b.userId}</td>
                    <td>{b.name}</td>
                    <td>{b.businessNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "buyer" && (
          <div className="tab-panel">
            <form className="search-form" onSubmit={handleBuyerSearch}>
              <input
                type="text"
                placeholder="입주자명 / 아이디 검색"
                value={buyerSearch}
                onChange={(e) => setBuyerSearch(e.target.value)}
              />
              <button type="submit">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </button>
            </form>

            <table className="approve-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>아이디</th>
                  <th>계약자명</th>
                  <th>동/호수</th>
                </tr>
              </thead>
              <tbody>
                {unapprovedBuyers.map((b, idx) => (
                  <tr
                    key={b._id}
                    onClick={() => handleBuyerClick(b._id)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{idx + 1}</td>
                    <td>{b.userId}</td>
                    <td>{b.name}</td>
                    <td>
                      {b.dong}동 {b.ho}호
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminApprovePage;
