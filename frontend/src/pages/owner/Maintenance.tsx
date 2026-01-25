import { useEffect, useMemo, useState } from "react"

import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { maintenanceService } from "@/services/maintenance.service"
import { propertyService } from "@/services/property.service"

import type { MaintenanceTicket, MaintenancePriority, MaintenanceStatus } from "@/types/maintenance"
import type { Property } from "@/types/property"

export default function Maintenance() {
  const [properties, setProperties] = useState<Property[]>([])
  const [tickets, setTickets] = useState<MaintenanceTicket[]>([])
  const [loading, setLoading] = useState(true)

  // filters
  const [query, setQuery] = useState("")
  const [propertyId, setPropertyId] = useState<string>("ALL")
  const [status, setStatus] = useState<MaintenanceStatus | "ALL">("ALL")
  const [priority, setPriority] = useState<MaintenancePriority | "ALL">("ALL")

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const [props, data] = await Promise.all([
          propertyService.listOwnerProperties(),
          maintenanceService.listOwnerTickets(),
        ])
        setProperties(props)
        setTickets(data)
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  // filtering
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return tickets
      .filter((t) => (propertyId === "ALL" ? true : t.propertyId === propertyId))
      .filter((t) => (status === "ALL" ? true : t.status === status))
      .filter((t) => (priority === "ALL" ? true : t.priority === priority))
      .filter((t) => {
        if (!q) return true
        return (
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.propertyName.toLowerCase().includes(q) ||
          (t.unitLabel?.toLowerCase().includes(q) ?? false) ||
          t.status.toLowerCase().includes(q) ||
          t.priority.toLowerCase().includes(q)
        )
      })
  }, [tickets, query, propertyId, status, priority])

  // KPI summary
  const kpis = useMemo(() => {
    const open = tickets.filter((t) => t.status === "OPEN").length
    const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length
    const resolved = tickets.filter((t) => t.status === "RESOLVED").length
    const urgent = tickets.filter((t) => t.priority === "URGENT").length
    return { open, inProgress, resolved, urgent }
  }, [tickets])

  // status badge mapping
  const statusBadge = (s: MaintenanceStatus) => {
    if (s === "RESOLVED") return <StatusBadge status="RESOLVED" />
    if (s === "IN_PROGRESS") return <StatusBadge status="IN_PROGRESS" />
    return <StatusBadge status="PENDING" />
  }

  // update ticket status (mock)
  const updateStatus = async (ticketId: string, newStatus: MaintenanceStatus) => {
    // ✅ later backend:
    // await maintenanceService.updateTicketStatus(ticketId, newStatus)

    // frontend mock:
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId
          ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
          : t
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance Requests</h1>
          <p className="text-sm text-muted-foreground">
            Track and resolve tenant issues across your property portfolio.
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Open</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.open}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.inProgress}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.resolved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Urgent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.urgent}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, description, unit..."
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
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as any)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="ALL">All priority</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filtered.length}</span> tickets
        </div>
      </div>

      {/* Tickets table */}
      <TableWrapper title="Tickets">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Update</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  Loading tickets...
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.unitLabel ? `Unit: ${t.unitLabel}` : "Unit: —"} • {t.createdBy}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Created: {new Date(t.createdAt).toLocaleString()}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-muted-foreground">{t.propertyName}</td>

                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full border">
                      {t.priority}
                    </span>
                  </td>

                  <td className="px-4 py-3">{statusBadge(t.status)}</td>

                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {t.status !== "IN_PROGRESS" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(t.id, "IN_PROGRESS")}
                        >
                          In Progress
                        </Button>
                      )}

                      {t.status !== "RESOLVED" && (
                        <Button size="sm" onClick={() => updateStatus(t.id, "RESOLVED")}>
                          Resolve
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No maintenance tickets found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableWrapper>

      {/* Note */}
      <div className="text-xs text-muted-foreground">
        Note: Status updates are currently frontend mock actions. Later this will call backend API{" "}
        <code>/maintenance/:id/status</code>.
      </div>
    </div>
  )
}
