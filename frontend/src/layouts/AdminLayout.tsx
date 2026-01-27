import { Outlet } from "react-router-dom"
import Sidebar from "@/components/common/Sidebar"
import Topbar from "@/components/common/Topbar"

import { LayoutDashboard, Users, Building2 } from "lucide-react"

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      <div className="flex">
        <Sidebar
          title="RentWise"
          subtitle="Admin Console"
          items={[
            { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
            { label: "Users", href: "/admin/users", icon: Users },
            { label: "Properties", href: "/admin/properties", icon: Building2 },
          ]}
        />

        <div className="flex-1 min-w-0">
          <Topbar />

          <main className="p-4 md:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
