import { useEffect, useMemo, useState } from "react"

import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast"

import { useToast } from "@/hooks/useToast"
import { rentService } from "@/services/rent.service"
import type { RentPayment, PaymentStatus } from "@/types/rent"

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`

type PayMethod = "UPI" | "CARD" | "BANK_TRANSFER" | "CASH"

export default function Payments() {
  const { toast, showToast } = useToast()

  const [payments, setPayments] = useState<RentPayment[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<PaymentStatus | "ALL">("ALL")

  // Pay modal state
  const [openPay, setOpenPay] = useState(false)
  const [paying, setPaying] = useState(false)
  const [method, setMethod] = useState<PayMethod>("UPI")
  const [upiId, setUpiId] = useState("")
  const [cardLast4, setCardLast4] = useState("")
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const data = await rentService.getTenantPayments()
        setPayments(data)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  // find next due payment (first unpaid by due date)
  const currentDue = useMemo(() => {
    const unpaid = payments
      .filter((p) => p.status !== "PAID")
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))

    return unpaid[0] ?? null
  }, [payments])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return payments
      .filter((p) => (status === "ALL" ? true : p.status === status))
      .filter((p) => {
        if (!q) return true
        return (
          p.propertyName.toLowerCase().includes(q) ||
          p.status.toLowerCase().includes(q) ||
          p.dueDate.toLowerCase().includes(q) ||
          (p.method?.toLowerCase().includes(q) ?? false)
        )
      })
  }, [payments, query, status])

  // KPI calculations
  const kpis = useMemo(() => {
    const paid = payments.filter((p) => p.status === "PAID")
    const overdue = payments.filter((p) => p.status === "OVERDUE")
    const pending = payments.filter((p) => p.status === "PENDING")

    const totalPaid = paid.reduce((sum, p) => sum + p.amount, 0)

    // on-time streak: consecutive PAID from latest entry
    let streak = 0
    for (const p of payments) {
      if (p.status === "PAID") streak++
      else break
    }

    const reliability =
      payments.length === 0 ? 0 : Math.round((paid.length / payments.length) * 100)

    return {
      totalPaid,
      overdueCount: overdue.length,
      pendingCount: pending.length,
      onTimeStreak: streak,
      reliability,
    }
  }, [payments])

  const openPayModal = (paymentId: string) => {
    setSelectedPaymentId(paymentId)
    setOpenPay(true)
    setPaying(false)
    setMethod("UPI")
    setUpiId("")
    setCardLast4("")
  }

  const closePayModal = () => {
    setOpenPay(false)
    setSelectedPaymentId(null)
  }

  const validatePaymentDetails = () => {
    if (!selectedPaymentId) return "Payment not selected."

    if (method === "UPI") {
      if (!upiId.trim() || !upiId.includes("@")) return "Enter a valid UPI ID."
    }
    if (method === "CARD") {
      if (!cardLast4.trim() || cardLast4.trim().length !== 4) {
        return "Enter last 4 digits of card."
      }
    }

    return null
  }

  const confirmPayNow = async () => {
    const err = validatePaymentDetails()
    if (err) {
      showToast({ title: "Payment error ❌", description: err })
      return
    }

    setPaying(true)

    try {
      // ✅ later backend call will happen here:
      // await tenantPaymentService.pay(paymentId, payload)

      // Mock delay
      await new Promise((r) => setTimeout(r, 800))

      setPayments((prev) =>
        prev.map((p) =>
          p.id === selectedPaymentId
            ? {
              ...p,
              status: "PAID",
              paidDate: new Date().toISOString().slice(0, 10),
              method,
            }
            : p
        )
      )

      showToast({
        title: "Payment successful ✅",
        description: `Paid via ${method}. Receipt will be available in history.`,
      })

      closePayModal()
    } catch (e: any) {
      showToast({
        title: "Payment failed ❌",
        description: e?.message || "Try again",
      })
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">
            Pay rent securely and keep track of your payment history.
          </p>
        </div>
      </div>

      {/* Current Due Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Current Due</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {currentDue ? (
            <>
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  Property:{" "}
                  <span className="font-medium text-foreground">
                    {currentDue.propertyName}
                  </span>
                </div>

                <div className="text-2xl font-bold">{money(currentDue.amount)}</div>

                <div className="text-sm text-muted-foreground">
                  Due on:{" "}
                  <span className="font-medium text-foreground">{currentDue.dueDate}</span>
                </div>

                <div className="pt-1">
                  <StatusBadge status={currentDue.status as any} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => openPayModal(currentDue.id)}>
                  Pay Now
                </Button>
                <Button variant="outline" onClick={() => setStatus("OVERDUE")}>
                  View Overdue
                </Button>
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              🎉 No dues pending. You’re officially a responsible adult.
            </div>
          )}
        </CardContent>
      </Card>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(kpis.totalPaid)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.overdueCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              On-time Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.onTimeStreak}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Reliability Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.reliability}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search property, method, date..."
            className="w-full md:w-[320px]"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="ALL">All status</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filtered.length}</span> payments
        </div>
      </div>

      {/* Table */}
      <TableWrapper title="Payment History">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Due</th>
              <th className="px-4 py-3 font-medium">Paid</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  Loading payments...
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{p.propertyName}</td>
                  <td className="px-4 py-3 font-semibold">{money(p.amount)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{p.dueDate}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {p.paidDate ? p.paidDate : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.method ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status as any} />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {p.status === "PAID" ? (
                        <Button size="sm" variant="outline" disabled>
                          Paid ✅
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => openPayModal(p.id)}>
                          Pay
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableWrapper>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[300]">
          <Toast open className="bg-[#0B0F14] border border-white/10 text-white">

            <div>
              <ToastTitle className="text-white font-semibold">
                {toast.title}
              </ToastTitle>

              {toast.description && (
                <ToastDescription className="text-white/70">
                  {toast.description}
                </ToastDescription>
              )}
            </div>

          </Toast>
        </div>
      )}

      {/* Pay modal */}
      {openPay && selectedPaymentId && (
        <div className="fixed inset-0 z-[250] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-background border p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold">Pay Rent</h2>
              <p className="text-sm text-muted-foreground">
                Choose a payment method and confirm.
              </p>
            </div>

            <div className="grid gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Payment Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as PayMethod)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>

              {method === "UPI" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">UPI ID</label>
                  <Input
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. name@upi"
                  />
                </div>
              )}

              {method === "CARD" && (
                <div className="space-y-1">
                  <label className="text-sm font-medium">Card last 4 digits</label>
                  <Input
                    value={cardLast4}
                    onChange={(e) => setCardLast4(e.target.value)}
                    placeholder="1234"
                    maxLength={4}
                  />
                </div>
              )}

              {(method === "BANK_TRANSFER" || method === "CASH") && (
                <div className="text-sm text-muted-foreground border rounded-xl p-3">
                  This is a mock flow. In real life, you’ll get bank details or a receipt process.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={closePayModal} disabled={paying}>
                Cancel
              </Button>
              <Button onClick={confirmPayNow} disabled={paying}>
                {paying ? "Processing..." : "Confirm Payment"}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Note: This payment is currently simulated in frontend. Backend will confirm and generate receipt.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
