import { useEffect, useMemo, useState } from "react"

import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast"

import { useToast } from "@/hooks/useToast"
import { maintenanceService } from "@/services/maintenance.service"
import type {
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceTicket,
} from "@/types/maintenance"

type CreateForm = {
  title: string
  propertyId: string
  propertyName: string
  unitLabel: string
  priority: MaintenancePriority
  description: string
}

// ✅ Mock property list (later fetch from lease service)
const tenantProperty = {
  propertyId: "p1",
  propertyName: "Skyline Residency",
  unitLabel: "A-202",
}

export default function Maintenance() {
  const { toast, showToast } = useToast()

  const [tickets, setTickets] = useState<MaintenanceTicket[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<MaintenanceStatus | "ALL">("ALL")
  const [priorityFilter, setPriorityFilter] = useState<MaintenancePriority | "ALL">("ALL")

  // Form
  const [form, setForm] = useState<CreateForm>({
    title: "",
    propertyId: tenantProperty.propertyId,
    propertyName: tenantProperty.propertyName,
    unitLabel: tenantProperty.unitLabel,
    priority: "MEDIUM",
    description: "",
  })

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const data = await maintenanceService.listTenantTickets()
      setTickets(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return tickets
      .filter((t) => (status === "ALL" ? true : t.status === status))
      .filter((t) => (priorityFilter === "ALL" ? true : t.priority === priorityFilter))
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
  }, [tickets, query, status, priorityFilter])

  const kpis = useMemo(() => {
    const open = tickets.filter((t) => t.status === "OPEN").length
    const inProgress = tickets.filter((t) => t.status === "IN_PROGRESS").length
    const resolved = tickets.filter((t) => t.status === "RESOLVED").length
    const urgent = tickets.filter((t) => t.priority === "URGENT").length
    return { open, inProgress, resolved, urgent }
  }, [tickets])

  const badgeForStatus = (s: MaintenanceStatus) => {
    if (s === "RESOLVED") return <StatusBadge status="RESOLVED" />
    if (s === "IN_PROGRESS") return <StatusBadge status="IN_PROGRESS" />
    return <StatusBadge status="PENDING" />
  }

  const validate = () => {
    if (!form.title.trim()) return "Title is required"
    if (form.title.trim().length < 5) return "Title must be at least 5 characters"
    if (!form.description.trim()) return "Description is required"
    if (form.description.trim().length < 10) return "Description must be at least 10 characters"
    return null
  }

  const submitTicket = async () => {
    const err = validate()
    if (err) {
      showToast({ title: "Invalid request ❌", description: err })
      return
    }

    try {
      await maintenanceService.createTicket({
        title: form.title,
        description: form.description,
        propertyId: form.propertyId,
        unitLabel: form.unitLabel,
        priority: form.priority,
      })

      // ✅ Add mock ticket instantly in frontend (for demo)
      const newTicket: MaintenanceTicket = {
        id: `m-${Date.now()}`,
        title: form.title.trim(),
        description: form.description.trim(),
        propertyId: form.propertyId,
        propertyName: form.propertyName,
        unitLabel: form.unitLabel,
        createdBy: "You",
        role: "TENANT",
        status: "OPEN",
        priority: form.priority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTickets((prev) => [newTicket, ...prev])

      setForm((prev) => ({
        ...prev,
        title: "",
        description: "",
        priority: "MEDIUM",
      }))

      showToast({
        title: "Request submitted ✅",
        description: "Maintenance ticket created successfully.",
      })
    } catch (e: any) {
      showToast({
        title: "Submission failed ❌",
        description: e?.message || "Try again",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-sm text-muted-foreground">
            Submit new requests and track the resolution progress.
          </p>
        </div>

        <Button variant="outline" onClick={fetchTickets}>
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
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

      {/* Create Request */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Submit New Request</CardTitle>
          <p className="text-sm text-muted-foreground">
            Provide clear details so the owner can resolve faster.
          </p>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. Water leakage in bathroom"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Priority</label>
            <select
              value={form.priority}
              onChange={(e) =>
                setForm((p) => ({ ...p, priority: e.target.value as MaintenancePriority }))
              }
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Property</label>
            <Input value={form.propertyName} disabled />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Unit</label>
            <Input value={form.unitLabel} disabled />
          </div>

          <div className="space-y-1 md:col-span-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Explain the issue clearly with location/conditions…"
              className="min-h-[110px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="md:col-span-2 flex justify-end">
            <Button onClick={submitTicket}>Submit Request</Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search ticket title / unit / status..."
            className="w-full md:w-[320px]"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="ALL">All status</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
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
          Showing <span className="font-medium">{filtered.length}</span> requests
        </div>
      </div>

      {/* Table */}
      <TableWrapper title="Your Requests">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Request</th>
              <th className="px-4 py-3 font-medium">Priority</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Updated</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  Loading requests...
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="px-4 py-3">
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {t.propertyName} {t.unitLabel ? `• Unit ${t.unitLabel}` : ""}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-1">
                      {t.description}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className="text-xs font-medium px-2 py-1 rounded-full border">
                      {t.priority}
                    </span>
                  </td>

                  <td className="px-4 py-3">{badgeForStatus(t.status)}</td>

                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(t.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  No maintenance requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableWrapper>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[300]">
          <Toast open>
            <div>
              <ToastTitle>{toast.title}</ToastTitle>
              {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
            </div>
          </Toast>
        </div>
      )}
    </div>
  )
}
