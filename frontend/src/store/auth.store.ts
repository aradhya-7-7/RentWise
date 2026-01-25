import { create } from "zustand"

export type Role = "ADMIN" | "OWNER" | "TENANT"

export type User = {
  id: string
  name: string
  email: string
  role: Role
}

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isHydrated: boolean
}

type LoginPayload = {
  email: string
  password: string
}

type RegisterPayload = {
  name: string
  email: string
  password: string
  role: Exclude<Role, "ADMIN"> // ✅ Admin not selectable
}

type AuthActions = {
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  hydrate: () => void
}

const STORAGE_KEY = "rentwise_auth"

const saveAuth = (data: { user: User; token: string }) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEY)
}

const readAuth = (): { user: User; token: string } | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({

  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,

  // ✅ keep login session on refresh
  hydrate: () => {
    const data = readAuth()

    if (data?.user && data?.token) {
      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isHydrated: true,
      })
      return
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: true,
    })
  },

  // ✅ enterprise-ready login (mock now, API later)
  login: async ({ email, password }) => {
    if (!email || !password) {
      throw new Error("Email and password are required")
    }

    // ------------------------------------------
    // ✅ MOCK LOGIN (replace later with backend):
    // const res = await authService.login(payload)
    // set user+token using res.data
    // ------------------------------------------

    const normalized = email.trim().toLowerCase()

    let role: Role = "TENANT"
    let name = "Tenant User"

    if (normalized === "admin@demo.com") {
      role = "ADMIN"
      name = "Admin User"
    } else if (normalized === "owner@demo.com") {
      role = "OWNER"
      name = "Owner User"
    }

    const fakeUser: User = {
      id: `user-${role.toLowerCase()}-1`,
      name,
      email: normalized,
      role,
    }

    const fakeToken = `mock-token-${Date.now()}`

    saveAuth({ user: fakeUser, token: fakeToken })

    set({
      user: fakeUser,
      token: fakeToken,
      isAuthenticated: true,
    })
  },

  // ✅ register (mock now)
  register: async ({ name, email, password, role }) => {
    if (!name.trim()) throw new Error("Name is required")
    if (!email.trim()) throw new Error("Email is required")
    if (!password.trim() || password.length < 6)
      throw new Error("Password must be at least 6 characters")

    // ------------------------------------------
    // ✅ MOCK REGISTER (replace later with backend)
    // const res = await authService.register(payload)
    // ------------------------------------------

    const normalized = email.trim().toLowerCase()

    const fakeUser: User = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalized,
      role,
    }

    const fakeToken = `mock-token-${Date.now()}`

    saveAuth({ user: fakeUser, token: fakeToken })

    set({
      user: fakeUser,
      token: fakeToken,
      isAuthenticated: true,
    })
  },

  logout: () => {
    clearAuth()
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  },
}))
