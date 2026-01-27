import { NavLink } from "react-router-dom"
import type { LucideIcon } from "lucide-react"

type NavItem = {
  label: string
  href: string
  icon?: LucideIcon
}

export default function Sidebar({
  title = "RentWise",
  subtitle = "Property Portal",
  items,
}: {
  title?: string
  subtitle?: string
  items: NavItem[]
}) {
  return (
    <aside className="hidden md:flex md:w-64 lg:w-72 flex-col border-r border-white/10 bg-[#0F1622]">
      {/* Brand */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8922F] shadow-[0_0_20px_rgba(212,175,55,0.25)]" />
          <div className="leading-tight">
            <div className="text-white font-bold tracking-tight">{title}</div>
            <div className="text-xs text-white/60">{subtitle}</div>
          </div>
        </div>
      </div>

      {/* Links */}
      <nav className="p-3 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                [
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition",
                  isActive
                    ? "bg-[#D4AF37]/15 border border-[#D4AF37]/25 text-[#D4AF37] shadow-[0_0_18px_rgba(212,175,55,0.12)]"
                    : "border border-transparent text-white/75 hover:bg-white/5 hover:text-white",
                ].join(" ")
              }
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="mt-auto p-4 text-xs text-white/40 border-t border-white/10">
        © {new Date().getFullYear()} RentWise
      </div>
    </aside>
  )
}
