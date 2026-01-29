import { useMemo, useState } from "react"

import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type PropertyStatus = "OCCUPIED" | "VACANT" | "PARTIAL"

type PropertyRow = {
  id: string
  name: string
  address: string
  city: string
  ownerName: string
  status: PropertyStatus
  totalUnits: number
  occupiedUnits: number
  createdAt: string
}

export default function Properties() {
  // ✅ Replace later with: propertyService.listAllProperties()
  const [properties] = useState<PropertyRow[]>([
    {
      id: "p1",
      name: "Skyline Residency",
      address: "Baner Road",
      city: "Pune",
      ownerName: "Raj Gupta",
      status: "PARTIAL",
      totalUnits: 20,
      occupiedUnits: 16,
      createdAt: "2025-12-21",
    },
    {
      id: "p2",
      name: "Green Valley Homes",
      address: "Hinjewadi Phase 1",
      city: "Pune",
      ownerName: "Vivek Singh",
      status: "OCCUPIED",
      totalUnits: 12,
      occupiedUnits: 12,
      createdAt: "2025-12-27",
    },
    {
      id: "p3",
      name: "Sunrise Apartments",
      address: "Kothrud",
      city: "Pune",
      ownerName: "Aman Verma",
      status: "VACANT",
      totalUnits: 8,
      occupiedUnits: 0,
      createdAt: "2026-01-02",
    },
  ])

  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "ALL">("ALL")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return properties
      .filter((p) => (statusFilter === "ALL" ? true : p.status === statusFilter))
      .filter((p) => {
        if (!q) return true
        return (
          p.name.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.ownerName.toLowerCase().includes(q)
        )
      })
  }, [properties, query, statusFilter])

  const kpis = useMemo(() => {
    const totalProps = properties.length
    const totalUnits = properties.reduce((sum, p) => sum + p.totalUnits, 0)
    const occupiedUnits = properties.reduce((sum, p) => sum + p.occupiedUnits, 0)

    const occupancy = totalUnits === 0 ? 0 : Math.round((occupiedUnits / totalUnits) * 100)

    const vacantUnits = totalUnits - occupiedUnits

    const ownersCount = new Set(properties.map((p) => p.ownerName)).size

    return {
      totalProps,
      totalUnits,
      occupiedUnits,
      vacantUnits,
      occupancy,
      ownersCount,
    }
  }, [properties])

  const vacancyBadge = (status: PropertyStatus) => {
    if (status === "OCCUPIED") return <StatusBadge status="RESOLVED" />
    if (status === "PARTIAL") return <StatusBadge status="IN_PROGRESS" />
    return <StatusBadge status="OVERDUE" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
Properties Overview</h1>
          <p className="text-sm text-white/60">
            Read-only property visibility for admin monitoring and occupancy insights.
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Properties
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.totalProps}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {kpis.ownersCount} owners
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Occupancy Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.occupancy}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpis.occupiedUnits}/{kpis.totalUnits} units occupied
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vacant Units
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.vacantUnits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Opportunity for new leases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Owners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.ownersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active portfolio managers
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
      placeholder="Search by property, owner, city..."
      className="w-full md:w-[340px]"
    />

    <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
  <SelectTrigger className="w-full md:w-[180px]">
    <SelectValue placeholder="All status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="ALL">All status</SelectItem>
    <SelectItem value="OCCUPIED">Occupied</SelectItem>
    <SelectItem value="PARTIAL">Partial</SelectItem>
    <SelectItem value="VACANT">Vacant</SelectItem>
  </SelectContent>
</Select>

  </div>

  <div className="text-sm text-white/60">
    Showing <span className="font-medium text-white">{filtered.length}</span>{" "}
    properties
  </div>
</div>


      {/* Table */}
      <TableWrapper title="Properties">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Owner</th>
              <th className="px-4 py-3 font-medium">Occupancy</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => {
              const vacantUnits = p.totalUnits - p.occupiedUnits
              const percent =
                p.totalUnits === 0 ? 0 : Math.round((p.occupiedUnits / p.totalUnits) * 100)

              return (
                <tr key={p.id} className="border-t border-white/10 hover:bg-white/5 transition">
                  {/* Property */}
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.address}, {p.city}
                    </div>
                  </td>

                  {/* Owner */}
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.ownerName}</div>
                    <div className="text-xs text-muted-foreground">Owner</div>
                  </td>

                  {/* Occupancy */}
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {p.occupiedUnits}/{p.totalUnits} ({percent}%)
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {vacantUnits} vacant units
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">{vacancyBadge(p.status)}</td>

                  {/* Created */}
                  <td className="px-4 py-3 text-muted-foreground">{p.createdAt}</td>
                </tr>
              )
            })}

            {filtered.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-muted-foreground" colSpan={5}>
                  No properties found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableWrapper>
    </div>
  )
}
