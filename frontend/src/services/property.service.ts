import { api } from "@/services/api"
import type { Property } from "@/types/property"

// ✅ Toggle this later to false when backend is ready
const MOCK_API = true

const mockProperties: Property[] = [
  {
    id: "p1",
    name: "Skyline Residency",
    address: "Baner Road",
    city: "Pune",
    status: "PARTIAL",
    totalUnits: 20,
    occupiedUnits: 16,
    ownerId: "owner-1",
    ownerName: "Owner User",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p2",
    name: "Green Valley Homes",
    address: "Hinjewadi Phase 1",
    city: "Pune",
    status: "OCCUPIED",
    totalUnits: 12,
    occupiedUnits: 12,
    ownerId: "owner-1",
    ownerName: "Owner User",
    createdAt: new Date().toISOString(),
  },
]

export const propertyService = {
  // OWNER
  async listOwnerProperties(): Promise<Property[]> {
    if (MOCK_API) return mockProperties

    const res = await api.get<Property[]>("/owner/properties")
    return res.data
  },

  // ADMIN
  async listAllProperties(): Promise<Property[]> {
    if (MOCK_API) return mockProperties

    const res = await api.get<Property[]>("/admin/properties")
    return res.data
  },

  async getPropertyById(id: string): Promise<Property> {
    if (MOCK_API) {
      const p = mockProperties.find((x) => x.id === id)
      if (!p) throw new Error("Property not found")
      return p
    }

    const res = await api.get<Property>(`/properties/${id}`)
    return res.data
  },
}
