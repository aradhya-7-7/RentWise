export type Role = "ADMIN" | "OWNER" | "TENANT"

export interface User {
  id: string
  name: string
  email: string
  role: Role
}
