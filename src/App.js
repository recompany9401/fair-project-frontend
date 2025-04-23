import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import BuyerRegisterForm from "./pages/BuyerRegisterForm";
import BusinessRegisterForm from "./pages/BusinessRegisterForm";
import BusinessHomePage from "./pages/BusinessHomePage";
import BuyerHomePage from "./pages/BuyerHomePage";
import AddProductPage from "./pages/AddProductPage";
import BuyerPurchaseList from "./pages/BuyerPurchaseList";
import BuyerPurchaseDetail from "./pages/BuyerPurchaseDetail";
import OptionDetailPage from "./pages/OptionDetailPage";
import AdminHomePage from "./pages/AdminHomePage";
import BusinessManagePage from "./pages/BusinessManagePage";
import BusinessDetailPage from "./pages/BusinessDetailPage";
import BuyerManagePage from "./pages/BuyerManagePage";
import BuyerDetailPage from "./pages/BuyerDetailPage";
import PurchaseManagePage from "./pages/PurchaseManagePage";
import AdminApprovePage from "./pages/AdminApprovePage";
import AdminApproveDetailPage from "./pages/AdminApproveDetailPage";
import PurchaseDetailPage from "./pages/PurchaseDetailPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register/buyer" element={<BuyerRegisterForm />} />
        <Route path="/register/business" element={<BusinessRegisterForm />} />

        <Route path="/business-home" element={<BusinessHomePage />} />
        <Route path="/business/add-product" element={<AddProductPage />} />
        <Route path="/buyer-home" element={<BuyerHomePage />} />
        <Route path="/buyer-purchase-list" element={<BuyerPurchaseList />} />
        <Route
          path="/buyer/purchase-detail/:purchaseId"
          element={<BuyerPurchaseDetail />}
        />
        <Route path="/business/option-detail" element={<OptionDetailPage />} />

        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/admin/business-manage" element={<BusinessManagePage />} />
        <Route
          path="/admin/business-detail/:id"
          element={<BusinessDetailPage />}
        />
        <Route path="/admin/buyer-manage" element={<BuyerManagePage />} />
        <Route path="/admin/buyer-detail/:id" element={<BuyerDetailPage />} />
        <Route path="/admin/purchase-manage" element={<PurchaseManagePage />} />
        <Route path="/admin/approve" element={<AdminApprovePage />} />
        <Route
          path="/admin/approve-detail/:type/:id"
          element={<AdminApproveDetailPage />}
        />
        <Route
          path="/admin/purchase-detail/:id"
          element={<PurchaseDetailPage />}
        />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
