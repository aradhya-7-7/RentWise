import { Navigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth.store"

export default function RedirectIfAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, isHydrated } = useAuthStore()

  // ✅ Never show blank screen
  if (!isHydrated) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>
  }

  if (isAuthenticated && user) {
    if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />
    if (user.role === "OWNER") return <Navigate to="/owner/dashboard" replace />
    return <Navigate to="/tenant/dashboard" replace />
  }

  return <>{children}</>
}
