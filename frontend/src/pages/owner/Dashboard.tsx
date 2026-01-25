import { useEffect, useMemo, useState } from "react"

import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { propertyService } from "@/services/property.service"
import { rentService } from "@/services/rent.service"
import { maintenanceService } from "@/services/maintenance.service"

import type { Property } from "@/types/property"
import type { RentPayment } from "@/types/rent"
import type { MaintenanceTicket } from "@/types/maintenance"

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([])
  const [rent, setRent] = useState<RentPayment[]>([])
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([])

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const [props, rentLedger, maint] = await Promise.all([
          propertyService.listOwnerProperties(),
          rentService.getOwnerRentLedger(),
          maintenanceService.listOwnerTickets(),
        ])

        setProperties(props)
        setRent(rentLedger)
        setTickets(maint)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  const kpis = useMemo(() => {
    const totalProps = properties.length
    const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0)
    const occupiedUnits = properties.reduce((sum, p) => sum + p.occupiedUnits, 0)

    const occupancy = totalUnits === 0 ? 0 : Math.round((occupiedUnits / totalUnits) * 100)

    const totalCollected = rent
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0)

    const overdueAmount = rent
      .filter((p) => p.status === "OVERDUE")
      .reduce((sum, p) => sum + p.amount, 0)

    const openTickets = tickets.filter((t) => t.status !== "RESOLVED").length
    const urgentTickets = tickets.filter((t) => t.priority === "URGENT").length

    return {
      totalProps,
      totalUnits,
      occupancy,
      totalCollected,
      overdueAmount,
      openTickets,
      urgentTickets,
    }
  }, [properties, rent, tickets])

  const rentPreview = useMemo(() => {
    // show latest 5 items
    return [...rent].slice(0, 5)
  }, [rent])

  const ticketPreview = useMemo(() => {
    // show latest 5 tickets
    return [...tickets].slice(0, 5)
  }, [tickets])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Owner Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Track rent collections, property occupancy and maintenance tickets.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.totalProps}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.totalUnits} total units
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.occupancy}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Higher occupancy → stable cashflow
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Collected (Paid)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{kpis.totalCollected}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total paid rent in ledger
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overdue Amount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{kpis.overdueAmount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Needs follow-up
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2nd KPI row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Open Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.openTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active maintenance requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Urgent Tickets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.urgentTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Immediate action required
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dashboard Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold">
              {loading ? "Loading..." : "Up to date ✅"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Data from services layer (mock / API)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Rent Ledger Preview */}
        <TableWrapper title="Rent Ledger (Preview)">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Tenant</th>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {rentPreview.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.tenantName}</div>
                    <div className="text-xs text-muted-foreground">
                      Due: {r.dueDate}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {r.propertyName}
                  </td>

                  <td className="px-4 py-3 font-medium">₹{r.amount}</td>

                  <td className="px-4 py-3">
                    <StatusBadge status={r.status as any} />
                  </td>
                </tr>
              ))}

              {rentPreview.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    No rent records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </TableWrapper>

        {/* Maintenance Summary */}
        <TableWrapper title="Maintenance Summary">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="text-left">
                <th className="px-4 py-3 font-medium">Ticket</th>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {ticketPreview.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.unitLabel ? `Unit: ${t.unitLabel}` : "—"}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {t.propertyName}
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full border">
                      {t.priority}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge status={t.status === "RESOLVED" ? "RESOLVED" : "IN_PROGRESS"} />
                  </td>
                </tr>
              ))}

              {ticketPreview.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                    No maintenance tickets found.
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
