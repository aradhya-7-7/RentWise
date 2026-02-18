import { api } from "./api"

export const authService = {

  async login(payload: {
    email: string
    password: string
  }) {
    const res = await api.post("/auth/login", payload)
    return res.data
  },

  async register(payload: any) {
    const res = await api.post("/auth/register", payload)
    return res.data
  }

}
