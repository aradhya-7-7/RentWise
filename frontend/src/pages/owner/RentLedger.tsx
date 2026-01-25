import { useEffect, useMemo, useState } from "react"

import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { rentService } from "@/services/rent.service"
import { propertyService } from "@/services/property.service"

import type { RentPayment, PaymentStatus } from "@/types/rent"
import type { Property } from "@/types/property"

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`

export default function RentLedger() {
  const [properties, setProperties] = useState<Property[]>([])
  const [ledger, setLedger] = useState<RentPayment[]>([])
  const [loading, setLoading] = useState(true)

  // filters
  const [query, setQuery] = useState("")
  const [propertyId, setPropertyId] = useState<string>("ALL")
  const [status, setStatus] = useState<PaymentStatus | "ALL">("ALL")

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const [props, rent] = await Promise.all([
          propertyService.listOwnerProperties(),
          rentService.getOwnerRentLedger(),
        ])
        setProperties(props)
        setLedger(rent)
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  // apply filters in frontend (since mock)
  const filteredLedger = useMemo(() => {
    const q = query.trim().toLowerCase()

    return ledger
      .filter((r) => (propertyId === "ALL" ? true : r.propertyId === propertyId))
      .filter((r) => (status === "ALL" ? true : r.status === status))
      .filter((r) => {
        if (!q) return true
        return (
          r.tenantName.toLowerCase().includes(q) ||
          r.propertyName.toLowerCase().includes(q) ||
          r.status.toLowerCase().includes(q)
        )
      })
  }, [ledger, query, propertyId, status])

  const totals = useMemo(() => {
    const total = filteredLedger.reduce((sum, r) => sum + r.amount, 0)
    const paid = filteredLedger
      .filter((r) => r.status === "PAID")
      .reduce((sum, r) => sum + r.amount, 0)
    const pending = filteredLedger
      .filter((r) => r.status === "PENDING")
      .reduce((sum, r) => sum + r.amount, 0)
    const overdue = filteredLedger
      .filter((r) => r.status === "OVERDUE")
      .reduce((sum, r) => sum + r.amount, 0)

    return { total, paid, pending, overdue }
  }, [filteredLedger])

  const markPaid = async (paymentId: string) => {
    // ✅ backend later:
    // await rentService.markAsPaid(paymentId)

    // frontend mock update:
    setLedger((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: "PAID",
              paidDate: new Date().toISOString().slice(0, 10),
              method: "UPI",
            }
          : p
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rent & Payments</h1>
          <p className="text-sm text-muted-foreground">
            Track rent payments, identify overdue tenants and manage collections.
          </p>
        </div>
      </div>

      {/* KPI totals */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(totals.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on current filters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(totals.paid)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Collected payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(totals.pending)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Yet to be confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(totals.overdue)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Needs immediate follow-up
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tenant / property / status..."
            className="w-full md:w-[320px]"
          />

          <select
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="ALL">All properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

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
          Showing <span className="font-medium">{filteredLedger.length}</span>{" "}
          payments
        </div>
      </div>

      {/* Ledger Table */}
      <TableWrapper title="Rent Ledger">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Tenant</th>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Loading rent ledger...
                </td>
              </tr>
            )}

            {!loading &&
              filteredLedger.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.tenantName}</div>
                    <div className="text-xs text-muted-foreground">
                      {r.method ? `Method: ${r.method}` : "—"}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">{r.propertyName}</td>

                  <td className="px-4 py-3 font-semibold">{money(r.amount)}</td>

                  <td className="px-4 py-3 text-muted-foreground">{r.dueDate}</td>

                  <td className="px-4 py-3">
                    <StatusBadge status={r.status as any} />
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {r.status === "PAID" ? (
                        <Button size="sm" variant="outline" disabled>
                          Paid ✅
                        </Button>
                      ) : (
                        <Button size="sm" onClick={() => markPaid(r.id)}>
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && filteredLedger.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No rent payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableWrapper>

      {/* Notes */}
      <div className="text-xs text-muted-foreground">
        Note: “Mark Paid” is currently a frontend mock action. Later it will call
        backend API <code>/rent/:id/mark-paid</code>.
      </div>
    </div>
  )
}
