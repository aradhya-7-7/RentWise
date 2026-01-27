import { Outlet } from "react-router-dom"
import Sidebar from "@/components/common/Sidebar"
import Topbar from "@/components/common/Topbar"

import {
  LayoutDashboard,
  Building2,
  Users,
  ReceiptIndianRupee,
  Wrench,
} from "lucide-react"

export default function OwnerLayout() {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      <div className="flex">
        <Sidebar
          title="RentWise"
          subtitle="Owner Dashboard"
          items={[
            { label: "Dashboard", href: "/owner/dashboard", icon: LayoutDashboard },
            { label: "Properties", href: "/owner/properties", icon: Building2 },
            { label: "Tenants", href: "/owner/tenants", icon: Users },
            { label: "Rent Ledger", href: "/owner/rent-ledger", icon: ReceiptIndianRupee },
            { label: "Maintenance", href: "/owner/maintenance", icon: Wrench },
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
