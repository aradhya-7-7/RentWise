import { api } from "@/services/api"
import type { RentPayment, PaymentStatus } from "@/types/rent"

// ✅ Toggle this later to false when backend is ready
const MOCK_API = true

const mockRentLedger: RentPayment[] = [
  {
    id: "r1",
    propertyId: "p1",
    propertyName: "Skyline Residency",
    tenantName: "Aman Sharma",
    amount: 12000,
    dueDate: "2026-01-05",
    paidDate: "2026-01-04",
    status: "PAID",
    method: "UPI",
  },
  {
    id: "r2",
    propertyId: "p1",
    propertyName: "Skyline Residency",
    tenantName: "Ravi Singh",
    amount: 14000,
    dueDate: "2026-01-05",
    paidDate: null,
    status: "OVERDUE",
    method: "BANK_TRANSFER",
  },
  {
    id: "r3",
    propertyId: "p2",
    propertyName: "Green Valley Homes",
    tenantName: "Neha Verma",
    amount: 15000,
    dueDate: "2026-01-10",
    paidDate: null,
    status: "PENDING",
    method: "CASH",
  },
]

export type RentLedgerFilters = {
  propertyId?: string
  status?: PaymentStatus
}

export const rentService = {
  // OWNER
  async getOwnerRentLedger(filters?: RentLedgerFilters): Promise<RentPayment[]> {
    if (MOCK_API) {
      let data = [...mockRentLedger]

      if (filters?.propertyId) {
        data = data.filter((x) => x.propertyId === filters.propertyId)
      }

      if (filters?.status) {
        data = data.filter((x) => x.status === filters.status)
      }

      return data
    }

    const res = await api.get<RentPayment[]>("/owner/rent-ledger", {
      params: filters,
    })
    return res.data
  },

  // TENANT
  async getTenantPayments(): Promise<RentPayment[]> {
    if (MOCK_API) {
      // tenant-specific in real life; mock returning subset
      return mockRentLedger.filter((x) => x.tenantName.includes("Neha"))
    }

    const res = await api.get<RentPayment[]>("/tenant/payments")
    return res.data
  },

  // OWNER/ADMIN: mark as paid
  async markAsPaid(paymentId: string): Promise<void> {
    if (MOCK_API) return

    await api.patch(`/rent/${paymentId}/mark-paid`)
  },
}
