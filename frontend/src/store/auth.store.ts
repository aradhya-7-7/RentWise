import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { Role, User } from "@/types/user"
import { authService } from "@/services/auth.service"

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  // Real login (email/password)
  login: (email: string, password: string) => Promise<void>

  // Demo role login (quick testing)
  loginAsRole: (role: Role) => void

  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Uses authService (works with MOCK_AUTH true/false)
      login: async (email, password) => {
        const { user, token } = await authService.login({ email, password })

        set({
          user,
          token,
          isAuthenticated: true,
        })
      },

      // Keeps old demo login (optional)
      loginAsRole: (role) => {
        const demoUsers: Record<Role, User> = {
          ADMIN: {
            id: "admin-1",
            name: "Admin User",
            email: "admin@demo.com",
            role: "ADMIN",
          },
          OWNER: {
            id: "owner-1",
            name: "Owner User",
            email: "owner@demo.com",
            role: "OWNER",
          },
          TENANT: {
            id: "tenant-1",
            name: "Tenant User",
            email: "tenant@demo.com",
            role: "TENANT",
          },
        }

        set({
          user: demoUsers[role],
          token: `demo-token-${role.toLowerCase()}`,
          isAuthenticated: true,
        })
      },

      logout: () => {
        // optional: also call backend logout later
        // authService.logout().catch(() => {})

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: "rent-auth",
    }
  )
)
