import { useNavigate } from "react-router-dom"
import { useAuthStore } from "@/store/auth.store"
import { useToast } from "@/hooks/useToast"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { LogOut, User } from "lucide-react"

export default function Topbar() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const { showToast } = useToast()

  const handleLogout = () => {
    logout()
   showToast({
    title: "Logged out successfully ",
    description: "See you again soon!",
  })

 window.location.href = "/"
// ✅ Landing page
  }

  const initials =
    user?.name
      ?.split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() ?? "U"

  return (
   <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0B0F14]/80 backdrop-blur">

      <div className="h-14 px-4 md:px-6 flex items-center justify-between">
        <div className="font-semibold tracking-tight text-white">RentWise</div>

        <div className="flex items-center gap-3">
          <div className="text-right leading-tight hidden sm:block">
            <div className="text-sm font-medium text-white">{user?.name ?? "User"}</div>
            <div className="text-xs text-muted-foreground text-white/60">{user?.role}</div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 w-10 rounded-full p-0 text-white/60">
                <Avatar>
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-white/60">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => navigate("/")}
                className="gap-2 text-white/60"
              >
                <User className="h-4 w-4 text-white/60" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout} className="gap-2 text-white/60">
                <LogOut className="h-4 w-4 text-white/60" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
