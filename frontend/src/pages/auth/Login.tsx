import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth.store"
import type { Role } from "@/types/user"

export default function Login() {
  const navigate = useNavigate()
  const loginAsRole = useAuthStore((s) => s.loginAsRole)

  const handleLogin = (role: Role) => {
    loginAsRole(role)

    if (role === "ADMIN") navigate("/admin/dashboard")
    if (role === "OWNER") navigate("/owner/dashboard")
    if (role === "TENANT") navigate("/tenant/dashboard")
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-xl p-6 space-y-4">
        <h1 className="text-xl font-bold">Login</h1>
        <p className="text-sm text-muted-foreground">
          Demo login to test role-based pages.
        </p>

        <div className="flex flex-col gap-3">
          <Button onClick={() => handleLogin("ADMIN")}>Login as Admin</Button>
          <Button variant="outline" onClick={() => handleLogin("OWNER")}>
            Login as Owner
          </Button>
          <Button variant="secondary" onClick={() => handleLogin("TENANT")}>
            Login as Tenant
          </Button>
        </div>
      </div>
    </div>
  )
}
