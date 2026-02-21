import { create } from "zustand"
import { authService } from "@/services/auth.service"

export type Role = "ADMIN" | "OWNER" | "TENANT"

export type User = {
  id: number
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

export type RegisterPayload = {
  name: string
  email: string
  password: string
  role: "OWNER" | "TENANT"
  gender: "MALE" | "FEMALE" | "OTHER"
  aadharFile: File | null
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

  login: async ({ email, password }) => {
    const res = await authService.login({ email, password })

    const { user, token } = res

    saveAuth({ user, token })

    set({
      user,
      token,
      isAuthenticated: true,
    })
  },

  register: async (payload) => {
    const formData = new FormData()

    Object.entries(payload).forEach(([key, value]) => {
      if (!value) return
      formData.append(key, value as any)
    })

    const res = await authService.register(formData)

    const { user, token } = res

    saveAuth({ user, token })

    set({
      user,
      token,
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