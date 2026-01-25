import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"

const money = (n: number) => `₹${n.toLocaleString("en-IN")}`

export default function Lease() {
  // ✅ Later: fetch from leaseService.getTenantLease()
  const lease = {
    leaseId: "LEASE-2026-0012",
    status: "ACTIVE" as const,
    propertyName: "Skyline Residency",
    address: "Baner Road, Pune",
    unitLabel: "A-202",
    tenantName: "Neha Verma",
    startDate: "2025-11-01",
    endDate: "2026-10-31",
    rentAmount: 13500,
    deposit: 27000,
    billingCycle: "Monthly",
    dueDay: 5,
    lateFee: 250,
    noticePeriodDays: 30,
    ownerName: "Raj Gupta",
    ownerPhone: "+91 98765 00000",
  }

  const downloadLease = () => {
    // ✅ later backend: download lease pdf by id
    // window.open(`/api/tenant/lease/${lease.leaseId}/download`, "_blank")
    alert("📄 Download started (mock). Backend will provide real PDF download.")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lease Details</h1>
          <p className="text-sm text-muted-foreground">
            View your agreement terms and download the lease document.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={downloadLease}>
            Download PDF
          </Button>
        </div>
      </div>

      {/* Top summary cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lease ID
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{lease.leaseId}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Agreement reference number
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-lg font-bold">Active</div>
            <div>
              <StatusBadge status="RESOLVED" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Rent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{money(lease.rentAmount)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Due every month on {lease.dueDay}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Security Deposit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">{money(lease.deposit)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Refundable (subject to terms)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lease summary */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left: property + tenant */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Lease Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <div className="text-xs text-muted-foreground">Tenant</div>
              <div className="font-medium">{lease.tenantName}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Property</div>
              <div className="font-medium">{lease.propertyName}</div>
              <div className="text-xs text-muted-foreground">{lease.address}</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Unit</div>
              <div className="font-medium">{lease.unitLabel}</div>
            </div>

            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground">Owner</div>
              <div className="font-medium">{lease.ownerName}</div>
              <div className="text-xs text-muted-foreground">{lease.ownerPhone}</div>
            </div>
          </CardContent>
        </Card>

        {/* Right: terms table */}
        <div className="lg:col-span-2">
          <TableWrapper title="Agreement Terms">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-3 text-muted-foreground">Lease Start</td>
                  <td className="px-4 py-3 font-medium">{lease.startDate}</td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 text-muted-foreground">Lease End</td>
                  <td className="px-4 py-3 font-medium">{lease.endDate}</td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 text-muted-foreground">Billing Cycle</td>
                  <td className="px-4 py-3 font-medium">{lease.billingCycle}</td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 text-muted-foreground">Rent Due Day</td>
                  <td className="px-4 py-3 font-medium">Every month on {lease.dueDay}</td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 text-muted-foreground">Late Fee</td>
                  <td className="px-4 py-3 font-medium">{money(lease.lateFee)} / day</td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 text-muted-foreground">Notice Period</td>
                  <td className="px-4 py-3 font-medium">
                    {lease.noticePeriodDays} days
                  </td>
                </tr>

                <tr className="border-t">
                  <td className="px-4 py-3 text-muted-foreground">Deposit</td>
                  <td className="px-4 py-3 font-medium">{money(lease.deposit)}</td>
                </tr>
              </tbody>
            </table>
          </TableWrapper>

          {/* Footer note */}
          <div className="text-xs text-muted-foreground mt-3">
            Note: Lease PDF download is currently mock. Backend will provide signed agreement download.
          </div>
        </div>
      </div>
    </div>
  )
}
