import { useMemo, useState } from "react"

import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type TenantStatus = "ACTIVE" | "PENDING" | "INACTIVE"

type TenantRow = {
  id: string
  name: string
  email: string
  phone: string
  status: TenantStatus
  propertyName?: string
  unitLabel?: string
  rentAmount?: number
  leaseStart?: string
  leaseEnd?: string
}

type PropertyOption = {
  id: string
  name: string
  units: { id: string; label: string; available: boolean }[]
}

// ✅ Mock properties + units
const mockProperties: PropertyOption[] = [
  {
    id: "p1",
    name: "Skyline Residency",
    units: [
      { id: "u1", label: "A-101", available: false },
      { id: "u2", label: "A-102", available: true },
      { id: "u3", label: "A-201", available: true },
      { id: "u4", label: "A-202", available: false },
    ],
  },
  {
    id: "p2",
    name: "Green Valley Homes",
    units: [
      { id: "u5", label: "B-101", available: false },
      { id: "u6", label: "B-201", available: true },
    ],
  },
]

export default function Tenants() {
  // ✅ Later: fetch from tenantService.listOwnerTenants()
  const [tenants, setTenants] = useState<TenantRow[]>([
    {
      id: "t1",
      name: "Neha Verma",
      email: "neha.tenant@gmail.com",
      phone: "+91 98765 43210",
      status: "ACTIVE",
      propertyName: "Skyline Residency",
      unitLabel: "A-202",
      rentAmount: 13500,
      leaseStart: "2025-11-01",
      leaseEnd: "2026-10-31",
    },
    {
      id: "t2",
      name: "Ravi Singh",
      email: "ravi.tenant@gmail.com",
      phone: "+91 99001 22334",
      status: "ACTIVE",
      propertyName: "Skyline Residency",
      unitLabel: "A-201",
      rentAmount: 13500,
      leaseStart: "2025-12-01",
      leaseEnd: "2026-11-30",
    },
    {
      id: "t3",
      name: "Aman Sharma",
      email: "aman.tenant@gmail.com",
      phone: "+91 98111 11000",
      status: "PENDING",
    },
  ])

  // Filters
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<TenantStatus | "ALL">("ALL")

  // Modal state
  const [openAssign, setOpenAssign] = useState(false)
  const [selectedTenant, setSelectedTenant] = useState<TenantRow | null>(null)

  // Lease form
  const [propertyId, setPropertyId] = useState("")
  const [unitId, setUnitId] = useState("")
  const [rentAmount, setRentAmount] = useState("")
  const [leaseStart, setLeaseStart] = useState("")
  const [leaseEnd, setLeaseEnd] = useState("")

  const filteredTenants = useMemo(() => {
    const q = query.trim().toLowerCase()

    return tenants
      .filter((t) => (statusFilter === "ALL" ? true : t.status === statusFilter))
      .filter((t) => {
        if (!q) return true
        return (
          t.name.toLowerCase().includes(q) ||
          t.email.toLowerCase().includes(q) ||
          t.phone.toLowerCase().includes(q) ||
          (t.propertyName?.toLowerCase().includes(q) ?? false) ||
          (t.unitLabel?.toLowerCase().includes(q) ?? false)
        )
      })
  }, [tenants, query, statusFilter])

  const activeUnits = useMemo(() => {
    const prop = mockProperties.find((p) => p.id === propertyId)
    if (!prop) return []
    return prop.units.filter((u) => u.available)
  }, [propertyId])

  const openAssignLease = (tenant: TenantRow) => {
    setSelectedTenant(tenant)
    setOpenAssign(true)

    // reset
    setPropertyId("")
    setUnitId("")
    setRentAmount("")
    setLeaseStart("")
    setLeaseEnd("")
  }

  const closeAssignLease = () => {
    setOpenAssign(false)
    setSelectedTenant(null)
  }

  const validateLease = () => {
    if (!selectedTenant) return "No tenant selected"
    if (!propertyId) return "Select a property"
    if (!unitId) return "Select a unit"
    if (!rentAmount || Number(rentAmount) <= 0) return "Enter valid rent amount"
    if (!leaseStart) return "Select lease start date"
    if (!leaseEnd) return "Select lease end date"
    if (leaseEnd < leaseStart) return "Lease end date cannot be before start date"
    return null
  }

  const assignLease = () => {
    const err = validateLease()
    if (err) {
      alert(err)
      return
    }

    const prop = mockProperties.find((p) => p.id === propertyId)
    const unit = prop?.units.find((u) => u.id === unitId)

    if (!prop || !unit) {
      alert("Invalid property/unit selection")
      return
    }

    // ✅ Update tenant in table (mock action)
    setTenants((prev) =>
      prev.map((t) =>
        t.id === selectedTenant!.id
          ? {
              ...t,
              status: "ACTIVE",
              propertyName: prop.name,
              unitLabel: unit.label,
              rentAmount: Number(rentAmount),
              leaseStart,
              leaseEnd,
            }
          : t
      )
    )

    closeAssignLease()
  }

  const tenantStatusBadge = (status: TenantStatus) => {
    if (status === "ACTIVE") return <StatusBadge status="RESOLVED" />
    if (status === "PENDING") return <StatusBadge status="PENDING" />
    return <StatusBadge status="OVERDUE" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tenants & Leases</h1>
          <p className="text-sm text-muted-foreground">
            View tenant directory and assign lease agreements to units.
          </p>
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Tenants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tenants.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Leases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {tenants.filter((t) => t.status === "ACTIVE").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Assignment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {tenants.filter((t) => t.status === "PENDING").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex gap-3 items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by tenant, email, unit..."
            className="w-full md:w-[320px]"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredTenants.length}</span> tenants
        </div>
      </div>

      {/* Table */}
      <TableWrapper title="Tenant Directory">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Tenant</th>
              <th className="px-4 py-3 font-medium">Lease</th>
              <th className="px-4 py-3 font-medium">Rent</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTenants.map((t) => (
              <tr key={t.id} className="border-t">
                {/* Tenant */}
                <td className="px-4 py-3">
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.email}</div>
                  <div className="text-xs text-muted-foreground">{t.phone}</div>
                </td>

                {/* Lease */}
                <td className="px-4 py-3 text-muted-foreground">
                  {t.status === "ACTIVE" ? (
                    <>
                      <div className="font-medium text-foreground">
                        {t.propertyName} • {t.unitLabel}
                      </div>
                      <div className="text-xs">
                        {t.leaseStart} → {t.leaseEnd}
                      </div>
                    </>
                  ) : (
                    "—"
                  )}
                </td>

                {/* Rent */}
                <td className="px-4 py-3 font-medium">
                  {t.rentAmount ? `₹${t.rentAmount}` : "—"}
                </td>

                {/* Status */}
                <td className="px-4 py-3">{tenantStatusBadge(t.status)}</td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {t.status === "ACTIVE" ? (
                      <Button size="sm" variant="outline" onClick={() => openAssignLease(t)}>
                        Edit Lease
                      </Button>
                    ) : (
                      <Button size="sm" onClick={() => openAssignLease(t)}>
                        Assign Lease
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredTenants.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">
                  No tenants found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableWrapper>

      {/* Assign Lease Modal */}
      {openAssign && selectedTenant && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-background border p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold">Assign Lease</h2>
              <p className="text-sm text-muted-foreground">
                Tenant: <span className="font-medium text-foreground">{selectedTenant.name}</span>
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              {/* Property */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Property</label>
                <select
                  value={propertyId}
                  onChange={(e) => {
                    setPropertyId(e.target.value)
                    setUnitId("")
                  }}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select property</option>
                  {mockProperties.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Unit</label>
                <select
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  disabled={!propertyId}
                >
                  <option value="">{propertyId ? "Select unit" : "Select property first"}</option>
                  {activeUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rent */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Rent Amount</label>
                <Input
                  value={rentAmount}
                  onChange={(e) => setRentAmount(e.target.value)}
                  placeholder="e.g. 15000"
                  type="number"
                />
              </div>

              {/* Lease start */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Lease Start</label>
                <Input
                  value={leaseStart}
                  onChange={(e) => setLeaseStart(e.target.value)}
                  type="date"
                />
              </div>

              {/* Lease end */}
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm font-medium">Lease End</label>
                <Input
                  value={leaseEnd}
                  onChange={(e) => setLeaseEnd(e.target.value)}
                  type="date"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={closeAssignLease}>
                Cancel
              </Button>
              <Button onClick={assignLease}>Assign</Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Note: This is frontend mock assignment. Later it will create a Lease in backend.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
