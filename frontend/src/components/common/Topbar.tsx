import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth.store"

export default function Topbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur border-b">
      <div className="h-14 px-4 md:px-6 flex items-center justify-between">
        <div className="font-semibold tracking-tight">
          Property Management Platform
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right leading-tight hidden sm:block">
            <div className="text-sm font-medium">{user?.name ?? "User"}</div>
            <div className="text-xs text-muted-foreground">{user?.role}</div>
          </div>

          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  )
}
