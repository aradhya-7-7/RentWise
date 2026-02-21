import { api } from "./api"

type LoginPayload = {
  email: string
  password: string
}

export const authService = {

  login: async (payload: LoginPayload) => {
    const res = await api.post("/auth/login", payload)
    return res.data
  },

  register: async (formData: FormData) => {

    // IMPORTANT:
    // Do NOT set content-type manually.
    // Browser sets multipart boundary automatically.

    const res = await api.post("/auth/register", formData)

    return res.data
  }

}