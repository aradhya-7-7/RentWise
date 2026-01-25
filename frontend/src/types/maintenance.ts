export type MaintenanceStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED"
export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

export interface MaintenanceTicket {
  id: string
  title: string
  description: string
  propertyId: string
  propertyName: string
  unitLabel?: string
  createdBy: string
  role: "TENANT" | "OWNER"
  status: MaintenanceStatus
  priority: MaintenancePriority
  createdAt: string
  updatedAt: string
}
