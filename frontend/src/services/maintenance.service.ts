import { api } from "@/services/api"
import type { MaintenanceTicket, MaintenanceStatus } from "@/types/maintenance"

// ✅ Toggle this later to false when backend is ready
const MOCK_API = true

const mockTickets: MaintenanceTicket[] = [
  {
    id: "m1",
    title: "Water leakage in bathroom",
    description: "Water is leaking near washbasin pipe",
    propertyId: "p1",
    propertyName: "Skyline Residency",
    unitLabel: "A-302",
    createdBy: "Neha Verma",
    role: "TENANT",
    status: "OPEN",
    priority: "HIGH",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "m2",
    title: "AC service required",
    description: "AC cooling reduced, needs servicing",
    propertyId: "p2",
    propertyName: "Green Valley Homes",
    unitLabel: "B-201",
    createdBy: "Owner User",
    role: "OWNER",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export type MaintenanceFilters = {
  propertyId?: string
  status?: MaintenanceStatus
}

export type CreateTicketPayload = {
  title: string
  description: string
  propertyId: string
  unitLabel?: string
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
}

export const maintenanceService = {
  // OWNER
  async listOwnerTickets(filters?: MaintenanceFilters): Promise<MaintenanceTicket[]> {
    if (MOCK_API) {
      let data = [...mockTickets]
      if (filters?.propertyId) data = data.filter((t) => t.propertyId === filters.propertyId)
      if (filters?.status) data = data.filter((t) => t.status === filters.status)
      return data
    }

    const res = await api.get<MaintenanceTicket[]>("/owner/maintenance", {
      params: filters,
    })
    return res.data
  },

  // TENANT
  async listTenantTickets(): Promise<MaintenanceTicket[]> {
    if (MOCK_API) {
      return mockTickets.filter((t) => t.role === "TENANT")
    }

    const res = await api.get<MaintenanceTicket[]>("/tenant/maintenance")
    return res.data
  },

  // TENANT: create ticket
  async createTicket(payload: CreateTicketPayload): Promise<void> {
    if (MOCK_API) return

    await api.post("/tenant/maintenance", payload)
  },

  // OWNER/ADMIN: update status
  async updateTicketStatus(ticketId: string, status: MaintenanceStatus): Promise<void> {
    if (MOCK_API) return

    await api.patch(`/maintenance/${ticketId}/status`, { status })
  },
}
