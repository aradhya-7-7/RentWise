export type PropertyStatus = "OCCUPIED" | "VACANT" | "PARTIAL"

export interface Property {
  id: string
  name: string
  address: string
  city: string
  status: PropertyStatus
  totalUnits: number
  occupiedUnits: number
  ownerId: string
  ownerName: string
  createdAt: string
}
