import { useEffect, useMemo, useState } from "react"

import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { rentService } from "@/services/rent.service"
import { maintenanceService } from "@/services/maintenance.service"

import type { RentPayment } from "@/types/rent"
import type { MaintenanceTicket } from "@/types/maintenance"

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`

export default function Dashboard() {
  const [payments, setPayments] = useState<RentPayment[]>([])
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const [p, t] = await Promise.all([
          rentService.getTenantPayments(),
          maintenanceService.listTenantTickets(),
        ])
        setPayments(p)
        setTickets(t)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  // Lease Summary (mock from latest payment + ticket property)
  const leaseSummary = useMemo(() => {
    const last = payments[0]
    return {
      propertyName: last?.propertyName ?? "—",
      unitLabel: "A-202", // later from backend lease table
      monthlyRent: last?.amount ?? 0,
      leaseEnd: "2026-10-31", // later from backend lease table
    }
  }, [payments])

  // KPIs
  const kpis = useMemo(() => {
    const totalPaid = payments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0)

    const overdueCount = payments.filter((p) => p.status === "OVERDUE").length
    const pendingCount = payments.filter((p) => p.status === "PENDING").length

    const openTickets = tickets.filter((t) => t.status !== "RESOLVED").length

    // next due (mock logic)
    const nextDue = payments
      .filter((p) => p.status !== "PAID")
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0]

    return {
      totalPaid,
      overdueCount,
      pendingCount,
      openTickets,
      nextDueAmount: nextDue?.amount ?? 0,
      nextDueDate: nextDue?.dueDate ?? "—",
    }
  }, [payments, tickets])

  const paymentPreview = useMemo(() => [...payments].slice(0, 5), [payments])
  const ticketPreview = useMemo(() => [...tickets].slice(0, 5), [tickets])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tenant Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            View your lease, rent payments and maintenance requests.
          </p>
        </div>
      </div>

      {/* Lease summary card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Your Lease</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Property</div>
            <div className="font-medium">{leaseSummary.propertyName}</div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">Unit</div>
            <div className="font-medium">{leaseSummary.unitLabel}</div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">Monthly Rent</div>
            <div className="font-medium">
              {leaseSummary.monthlyRent ? money(leaseSummary.monthlyRent) : "—"}
            </div>
          </div>

          <div>
            <div className="text-muted-foreground text-xs">Lease End</div>
            <div className="font-medium">{leaseSummary.leaseEnd}</div>
          </div>
        </CardContent>
      </Card>

      {/* KPI row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Next Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.nextDueAmount ? money(kpis.nextDueAmount) : "—"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Due Date: {kpis.nextDueDate}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{money(kpis.totalPaid)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Payment history total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.pendingCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.openTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Maintenance requests active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Payments */}
        <TableWrapper title="Recent Payments">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Due</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    Loading payments...
                  </td>
                </tr>
              )}

              {!loading &&
                paymentPreview.map((p) => (
                  <tr key={p.id} className="border-t">
                    <td className="px-4 py-3 text-muted-foreground">{p.propertyName}</td>
                    <td className="px-4 py-3 font-semibold">{money(p.amount)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{p.dueDate}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={p.status as any} />
                    </td>
                  </tr>
                ))}

              {!loading && paymentPreview.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    No payment history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableWrapper>

        {/* Tickets */}
        <TableWrapper title="Maintenance Requests">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Issue</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                    Loading tickets...
                  </td>
                </tr>
              )}

              {!loading &&
                ticketPreview.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.propertyName} {t.unitLabel ? `• ${t.unitLabel}` : ""}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full border">
                        {t.priority}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <StatusBadge
                        status={
                          t.status === "RESOLVED"
                            ? "RESOLVED"
                            : t.status === "IN_PROGRESS"
                            ? "IN_PROGRESS"
                            : "PENDING"
                        }
                      />
                    </td>
                  </tr>
                ))}

              {!loading && ticketPreview.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground">
                    No maintenance requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableWrapper>
      </div>
    </div>
  )
}
