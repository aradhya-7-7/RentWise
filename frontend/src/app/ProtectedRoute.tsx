import { Navigate, useLocation } from "react-router-dom"
import type { Role } from "@/types/user"
import { useAuthStore } from "@/store/auth.store"

type ProtectedRouteProps = {
  allowedRoles?: Role[]
  children: React.ReactNode
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()

  // 1) Not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // 2) Logged in but role not allowed
  if (allowedRoles?.length && !allowedRoles.includes(user.role)) {
    // Redirect them to their own dashboard
    const redirectMap: Record<Role, string> = {
      ADMIN: "/admin/dashboard",
      OWNER: "/owner/dashboard",
      TENANT: "/tenant/dashboard",
    }

    return <Navigate to={redirectMap[user.role]} replace />
  }

  // 3) Allowed 
  return <>{children}</>
}
