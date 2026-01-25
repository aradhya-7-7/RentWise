import { useEffect, useMemo, useState } from "react"

import { propertyService } from "@/services/property.service"
import type { Property } from "@/types/property"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"

type UnitStatus = "OCCUPIED" | "VACANT"

type Unit = {
  id: string
  unitLabel: string
  rent: number
  status: UnitStatus
  tenantName?: string
}

const mockUnitsByProperty: Record<string, Unit[]> = {
  p1: [
    { id: "u1", unitLabel: "A-101", rent: 12000, status: "OCCUPIED", tenantName: "Aman Sharma" },
    { id: "u2", unitLabel: "A-102", rent: 12000, status: "VACANT" },
    { id: "u3", unitLabel: "A-201", rent: 13500, status: "OCCUPIED", tenantName: "Ravi Singh" },
    { id: "u4", unitLabel: "A-202", rent: 13500, status: "OCCUPIED", tenantName: "Neha Verma" },
  ],
  p2: [
    { id: "u5", unitLabel: "B-101", rent: 15000, status: "OCCUPIED", tenantName: "Sahil Jain" },
    { id: "u6", unitLabel: "B-201", rent: 15000, status: "OCCUPIED", tenantName: "Kunal Singh" },
  ],
}

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  // Search + selection
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  // Units drilldown state (mock for now)
  const [units, setUnits] = useState<Unit[]>([])
  const [unitSearch, setUnitSearch] = useState("")

  // Add unit modal state (simple)
  const [showAddUnit, setShowAddUnit] = useState(false)
  const [newUnitLabel, setNewUnitLabel] = useState("")
  const [newUnitRent, setNewUnitRent] = useState("")

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        const data = await propertyService.listOwnerProperties()
        setProperties(data)

        // auto select first
        if (data.length > 0) {
          setSelectedId(data[0].id)
        }
      } finally {
        setLoading(false)
      }
    }

    run()
  }, [])

  // Load units whenever property changes
  useEffect(() => {
    if (!selectedId) return

    // ✅ later replace this with service call:
    // ownerPropertyService.listUnits(selectedId)
    const propertyUnits = mockUnitsByProperty[selectedId] ?? []
    setUnits(propertyUnits)
  }, [selectedId])

  const filteredProperties = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return properties

    return properties.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q)
      )
    })
  }, [properties, query])

  const selectedProperty = useMemo(() => {
    if (!selectedId) return null
    return properties.find((p) => p.id === selectedId) ?? null
  }, [properties, selectedId])

  const filteredUnits = useMemo(() => {
    const q = unitSearch.trim().toLowerCase()
    if (!q) return units
    return units.filter(
      (u) =>
        u.unitLabel.toLowerCase().includes(q) ||
        (u.tenantName?.toLowerCase().includes(q) ?? false)
    )
  }, [units, unitSearch])

  const propertyOccupancyBadge = (p: Property) => {
    const vacant = p.totalUnits - p.occupiedUnits
    if (vacant === 0) return <StatusBadge status="RESOLVED" />
    if (p.occupiedUnits === 0) return <StatusBadge status="OVERDUE" />
    return <StatusBadge status="IN_PROGRESS" />
  }

  const handleAddUnit = () => {
    if (!selectedId) return
    if (!newUnitLabel.trim()) return
    const rent = Number(newUnitRent || 0)
    if (!rent || rent < 1) return

    const newUnit: Unit = {
      id: `unit-${Date.now()}`,
      unitLabel: newUnitLabel.trim(),
      rent,
      status: "VACANT",
    }

    setUnits((prev) => [newUnit, ...prev])

    setShowAddUnit(false)
    setNewUnitLabel("")
    setNewUnitRent("")
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties & Units</h1>
          <p className="text-sm text-muted-foreground">
            Manage your properties and drill down into unit-level occupancy.
          </p>
        </div>
      </div>

      {/* Two-panel layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT: Properties list */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Your Properties</CardTitle>
            <div className="pt-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search properties..."
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {loading && (
              <div className="text-sm text-muted-foreground">Loading properties...</div>
            )}

            {!loading && filteredProperties.length === 0 && (
              <div className="text-sm text-muted-foreground">No properties found.</div>
            )}

            <div className="space-y-2">
              {filteredProperties.map((p) => {
                const isActive = p.id === selectedId
                const vacant = p.totalUnits - p.occupiedUnits
                const percent =
                  p.totalUnits === 0 ? 0 : Math.round((p.occupiedUnits / p.totalUnits) * 100)

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={[
                      "w-full text-left rounded-xl border p-3 transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground border-accent"
                        : "hover:bg-accent/60",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.address}, {p.city}
                        </div>
                      </div>

                      <div className="shrink-0">{propertyOccupancyBadge(p)}</div>
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      {p.occupiedUnits}/{p.totalUnits} occupied ({percent}%) • {vacant} vacant
                    </div>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* RIGHT: Units drilldown */}
        <div className="lg:col-span-2 space-y-4">
          {/* Selected property summary */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">
                    {selectedProperty ? selectedProperty.name : "Select a property"}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedProperty
                      ? `${selectedProperty.address}, ${selectedProperty.city}`
                      : "Choose a property to view units."}
                  </p>
                </div>

                <Button
                  onClick={() => setShowAddUnit(true)}
                  disabled={!selectedProperty}
                >
                  + Add Unit
                </Button>
              </div>

              {selectedProperty && (
                <div className="pt-3 text-sm text-muted-foreground">
                  Units:{" "}
                  <span className="font-medium text-foreground">
                    {selectedProperty.occupiedUnits}/{selectedProperty.totalUnits}
                  </span>{" "}
                  occupied
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Units Table */}
          <TableWrapper title="Units">
            <div className="p-4 border-b flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
              <Input
                value={unitSearch}
                onChange={(e) => setUnitSearch(e.target.value)}
                placeholder="Search units / tenant..."
                className="w-full md:w-[320px]"
              />
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{filteredUnits.length}</span> units
              </div>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Unit</th>
                  <th className="px-4 py-3 font-medium">Tenant</th>
                  <th className="px-4 py-3 font-medium">Rent</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredUnits.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="px-4 py-3 font-medium">{u.unitLabel}</td>

                    <td className="px-4 py-3 text-muted-foreground">
                      {u.status === "OCCUPIED" ? u.tenantName : "—"}
                    </td>

                    <td className="px-4 py-3 font-medium">₹{u.rent}</td>

                    <td className="px-4 py-3">
                      {u.status === "OCCUPIED" ? (
                        <StatusBadge status="RESOLVED" />
                      ) : (
                        <StatusBadge status="OVERDUE" />
                      )}
                    </td>
                  </tr>
                ))}

                {filteredUnits.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                      No units found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </TableWrapper>
        </div>
      </div>

      {/* Add Unit modal (simple / no dependency) */}
      {showAddUnit && (
        <div className="fixed inset-0 z-[200] bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-background border p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold">Add Unit</h2>
              <p className="text-sm text-muted-foreground">
                Add a unit under{" "}
                <span className="font-medium">
                  {selectedProperty?.name ?? "property"}
                </span>
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Unit Label</label>
                <Input
                  value={newUnitLabel}
                  onChange={(e) => setNewUnitLabel(e.target.value)}
                  placeholder="e.g. A-301"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Rent Amount</label>
                <Input
                  value={newUnitRent}
                  onChange={(e) => setNewUnitRent(e.target.value)}
                  type="number"
                  placeholder="e.g. 15000"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowAddUnit(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUnit}>Add</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
