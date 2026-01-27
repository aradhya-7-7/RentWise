import { Outlet } from "react-router-dom"
import Sidebar from "@/components/common/Sidebar"
import Topbar from "@/components/common/Topbar"

import { LayoutDashboard, FileText, CreditCard, Wrench } from "lucide-react"

export default function TenantLayout() {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      <div className="flex">
        <Sidebar
          title="RentWise"
          subtitle="Tenant Portal"
          items={[
            { label: "Dashboard", href: "/tenant/dashboard", icon: LayoutDashboard },
            { label: "Lease", href: "/tenant/lease", icon: FileText },
            { label: "Payments", href: "/tenant/payments", icon: CreditCard },
            { label: "Maintenance", href: "/tenant/maintenance", icon: Wrench },
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
