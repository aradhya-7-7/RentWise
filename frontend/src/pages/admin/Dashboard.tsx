import { Button } from "@/components/ui/button"
import { useAuthStore } from "@/store/auth.store"

export default function AdminDashboard() {
  const logout = useAuthStore((s) => s.logout)

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <Button variant="outline" onClick={logout}>
        Logout
      </Button>
    </div>
  )
}
