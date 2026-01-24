import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Role, User } from "@/types/user"

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  loginAsRole: (role: Role) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      loginAsRole: (role) => {
        // Demo users for frontend-only testing
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
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
      },
    }),
    {
      name: "rent-auth", // localStorage key
    }
  )
)
