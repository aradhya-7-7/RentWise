import { NavLink } from "react-router-dom"
import type { Role } from "@/types/user"

type Props = {
  role: Role
}

type NavItem = {
  label: string
  to: string
}

const nav: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Users", to: "/admin/users" },
    { label: "Properties", to: "/admin/properties" },
  ],
  OWNER: [
    { label: "Dashboard", to: "/owner/dashboard" },
    { label: "Properties", to: "/owner/properties" },
    { label: "Tenants", to: "/owner/tenants" },
    { label: "Rent Ledger", to: "/owner/rent-ledger" },
    { label: "Maintenance", to: "/owner/maintenance" },
  ],
  TENANT: [
    { label: "Dashboard", to: "/tenant/dashboard" },
    { label: "Lease", to: "/tenant/lease" },
    { label: "Payments", to: "/tenant/payments" },
    { label: "Maintenance", to: "/tenant/maintenance" },
  ],
}

export default function Sidebar({ role }: Props) {
  return (
    <div className="h-full p-4">
      <div className="mb-6">
        <div className="text-lg font-bold tracking-tight">RentWise</div>
        <div className="text-xs text-muted-foreground">
          Role: <span className="font-medium">{role}</span>
        </div>
      </div>

      <nav className="space-y-1">
        {nav[role].map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              [
                "block rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "hover:bg-accent hover:text-accent-foreground",
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
