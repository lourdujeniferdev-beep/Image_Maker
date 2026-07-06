import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OtpVerification from "./pages/auth/OtpVerification";

import DashboardLayout from "./layouts/Dashbord";
import Dashboard from "./dashboard/Dashboard";
import OrganizationList from "./organization/OrganizationList";
import RoleList from "./roles/RoleList";
import UserList from "./users/UserList";
import ShopList from "./shops/ShopList";
import ServiceList from "./pages/services/ServiceList";
import OrdersList from "./pages/orders/OrdersList";
import CreateOrder from "./pages/orders/CreateOrder";
import PaymentList from "./pages/payments/PaymentList";
import OrderTracking from "./pages/tracking/OrderTracking";
import PickupPartnerList from "./pages/pickup/PickupPartnerList";
import DeliveryPartnerList from "./pages/delivery/DeliveryPartnerList";
import Ratinglist from "./pages/ratings/Ratinglist";
import ComplaintList from "./pages/complaints/ComplaintList";
import Notificationlist from "./pages/notifications/Notificationlist";
import ReportsDashboard from "./pages/reports/reportdashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<OtpVerification />} />

        {/* Dashboard Layout - Layout for all ERP modules */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/organizations" element={<OrganizationList />} />
          <Route path="/roles" element={<RoleList />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/shops" element={<ShopList />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/orders" element={<OrdersList />} />
          <Route path="/orders/create" element={<CreateOrder />} />
          <Route path="/payments" element={<PaymentList />} />
          <Route path="/tracking" element={<OrderTracking />} />
          <Route path="/pickup" element={<PickupPartnerList />} />
          <Route path="/delivery" element={<DeliveryPartnerList />} />
          <Route path="/ratings" element={<Ratinglist />} />
          <Route path="/complaints" element={<ComplaintList />} />
          <Route path="/notifications" element={<Notificationlist />} />
          <Route path="/reports" element={<ReportsDashboard />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;