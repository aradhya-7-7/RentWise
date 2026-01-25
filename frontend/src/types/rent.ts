export type PaymentStatus = "PAID" | "PENDING" | "OVERDUE"

export interface RentPayment {
  id: string
  propertyId: string
  propertyName: string
  tenantName: string
  amount: number
  dueDate: string
  paidDate?: string | null
  status: PaymentStatus
  method?: "UPI" | "CASH" | "CARD" | "BANK_TRANSFER"
}
