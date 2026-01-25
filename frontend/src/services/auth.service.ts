import { api } from "@/services/api"
import type { Role, User } from "@/types/user"

export type AuthResponse = {
  user: User
  token: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  role?: Role // optional, backend may control role assignment
}

// Toggle: frontend-only mode (mock)
const MOCK_AUTH = true

// Demo users
const demoUsers: Record<Role, User> = {
  ADMIN: { id: "admin-1", name: "Admin User", email: "admin@demo.com", role: "ADMIN" },
  OWNER: { id: "owner-1", name: "Owner User", email: "owner@demo.com", role: "OWNER" },
  TENANT: { id: "tenant-1", name: "Tenant User", email: "tenant@demo.com", role: "TENANT" },
}

export const authService = {
  // ----------------------------
  // LOGIN
  // ----------------------------
  async login(payload: LoginPayload): Promise<AuthResponse> {
    if (MOCK_AUTH) {
      // Map email to role for demo
      const role: Role =
        payload.email.includes("admin") ? "ADMIN" :
        payload.email.includes("owner") ? "OWNER" :
        "TENANT"

      return {
        user: demoUsers[role],
        token: `demo-token-${role.toLowerCase()}`,
      }
    }

    // backend expected: POST /auth/login
    const res = await api.post<AuthResponse>("/auth/login", payload)
    return res.data
  },

  // ----------------------------
  // REGISTER
  // ----------------------------
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    if (MOCK_AUTH) {
      const role: Role = payload.role ?? "TENANT"
      return {
        user: {
          id: `mock-${Date.now()}`,
          name: payload.name,
          email: payload.email,
          role,
        },
        token: `demo-token-${role.toLowerCase()}`,
      }
    }

    const res = await api.post<AuthResponse>("/auth/register", payload)
    return res.data
  },

  // ----------------------------
  // CURRENT USER
  // ----------------------------
  async me(): Promise<User> {
    if (MOCK_AUTH) {
      // In mock mode, use Zustand store’s current user
      const { user } = (await import("@/store/auth.store")).useAuthStore.getState()
      if (!user) throw new Error("Not logged in")
      return user
    }

    const res = await api.get<User>("/auth/me")
    return res.data
  },

  // ----------------------------
  // LOGOUT
  // ----------------------------
  async logout(): Promise<void> {
    if (MOCK_AUTH) return

    await api.post("/auth/logout")
  },
}
