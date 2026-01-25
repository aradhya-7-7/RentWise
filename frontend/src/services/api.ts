import axios, { AxiosError } from "axios"
import { useAuthStore } from "@/store/auth.store"

export const API_BASE_URL =
  import.meta.env.VITE_API_URL?.toString() || "http://localhost:5000/api"

export type ApiError = {
  message: string
  status?: number
  code?: string
  details?: unknown
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // keep true if backend uses cookies. If not, still fine.
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
})

//Attach token automatically
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// Central error handling
api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err.response?.status
    const data: any = err.response?.data

    const apiError: ApiError = {
      status,
      message:
        data?.message ||
        data?.error ||
        err.message ||
        "Something went wrong. Please try again.",
      code: data?.code,
      details: data,
    }

    // Auto logout on unauthorized
    if (status === 401) {
      // optional: prevent infinite loops on login endpoints
      const url = err.config?.url ?? ""
      const isAuthEndpoint = url.includes("/auth/login") || url.includes("/auth/register")

      if (!isAuthEndpoint) {
        useAuthStore.getState().logout()
      }
    }

    return Promise.reject(apiError)
  }
)
