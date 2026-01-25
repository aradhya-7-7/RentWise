import { Navigate, Route, Routes } from "react-router-dom"

import ProtectedRoute from "@/app/ProtectedRoute"

// layouts
import AdminLayout from "@/layouts/AdminLayout"
import OwnerLayout from "@/layouts/OwnerLayout"
import TenantLayout from "@/layouts/TenantLayout"

// auth pages
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"

// admin pages
import AdminDashboard from "@/pages/admin/Dashboard"
import AdminUsers from "@/pages/admin/Users"
import AdminProperties from "@/pages/admin/Properties"

// owner pages
import OwnerDashboard from "@/pages/owner/Dashboard"
import OwnerProperties from "@/pages/owner/Properties"
import OwnerTenants from "@/pages/owner/Tenants"
import OwnerRentLedger from "@/pages/owner/RentLedger"
import OwnerMaintenance from "@/pages/owner/Maintenance"

// tenant pages
import TenantDashboard from "@/pages/tenant/Dashboard"
import TenantLease from "@/pages/tenant/Lease"
import TenantPayments from "@/pages/tenant/Payments"
import TenantMaintenance from "@/pages/tenant/Maintenance"

// misc
import NotFound from "@/pages/NotFound"

export default function AppRoutes() {
  return (
    <Routes>
      {/* ---------- Public Routes ---------- */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ---------- Admin Routes ---------- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="properties" element={<AdminProperties />} />
      </Route>

      {/* ---------- Owner Routes ---------- */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={["OWNER"]}>
            <OwnerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/owner/dashboard" replace />} />
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="properties" element={<OwnerProperties />} />
        <Route path="tenants" element={<OwnerTenants />} />
        <Route path="rent-ledger" element={<OwnerRentLedger />} />
        <Route path="maintenance" element={<OwnerMaintenance />} />
      </Route>

      {/* ---------- Tenant Routes ---------- */}
      <Route
        path="/tenant"
        element={
          <ProtectedRoute allowedRoles={["TENANT"]}>
            <TenantLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/tenant/dashboard" replace />} />
        <Route path="dashboard" element={<TenantDashboard />} />
        <Route path="lease" element={<TenantLease />} />
        <Route path="payments" element={<TenantPayments />} />
        <Route path="maintenance" element={<TenantMaintenance />} />
      </Route>

      {/* ---------- Not Found ---------- */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
