import { Outlet } from "react-router-dom"
import Sidebar from "@/components/common/Sidebar"
import Topbar from "@/components/common/Topbar"

type Props = {
  role: "ADMIN" | "OWNER" | "TENANT"
}

export default function AppShell({ role }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r min-h-screen">
          <Sidebar role={role} />
        </aside>

        {/* Main */}
        <main className="flex-1 min-h-screen">
          <Topbar />
          <div className="p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
