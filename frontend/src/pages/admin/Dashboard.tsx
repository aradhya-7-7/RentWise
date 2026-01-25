import StatusBadge from "@/components/common/StatusBadge"
import TableWrapper from "@/components/common/TableWrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type ActivityStatus = "PAID" | "PENDING" | "OVERDUE" | "RESOLVED" | "IN_PROGRESS" | "URGENT"

type RecentActivity = {
  id: string
  type: "PAYMENT" | "MAINTENANCE" | "USER"
  title: string
  subtitle: string
  date: string
  status: ActivityStatus
}

export default function Dashboard() {
  //  Later replace these with API calls (admin.service)
  const kpis = [
    { label: "Total Owners", value: 12, hint: "+2 this month" },
    { label: "Total Tenants", value: 86, hint: "+7 this month" },
    { label: "Properties", value: 18, hint: "3 vacant units" },
    { label: "Maintenance Requests", value: 9, hint: "2 urgent" },
  ]

  const recentActivity: RecentActivity[] = [
    {
      id: "a1",
      type: "PAYMENT",
      title: "Rent payment received",
      subtitle: "Skyline Residency • Aman Sharma",
      date: "Today, 10:24 AM",
      status: "PAID",
    },
    {
      id: "a2",
      type: "MAINTENANCE",
      title: "New ticket created",
      subtitle: "Green Valley Homes • Water leakage",
      date: "Today, 09:10 AM",
      status: "URGENT",
    },
    {
      id: "a3",
      type: "USER",
      title: "Owner account updated",
      subtitle: "Owner: Raj Gupta",
      date: "Yesterday, 06:40 PM",
      status: "RESOLVED",
    },
    {
      id: "a4",
      type: "PAYMENT",
      title: "Rent payment pending",
      subtitle: "Skyline Residency • Ravi Singh",
      date: "Yesterday, 02:15 PM",
      status: "PENDING",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of platform health, users, properties and maintenance.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{kpi.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2">
          <TableWrapper title="Recent Activity">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium">Activity</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map((a) => (
                  <tr key={a.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-medium">{a.title}</div>
                      <div className="text-xs text-muted-foreground">{a.subtitle}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.date}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={a.status as any} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </div>

        {/* Side insights */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">System Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Occupancy</span>
                <span className="font-semibold">88%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Rent Collection</span>
                <span className="font-semibold">92%</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Avg. Resolution</span>
                <span className="font-semibold">2.1 days</span>
              </div>

              <div className="pt-2 text-xs text-muted-foreground">
                Tip: Review overdue payments weekly to reduce tenant churn.
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Urgent Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Water leakage</span>
                <StatusBadge status="URGENT" />
              </div>
              <div className="flex items-center justify-between">
                <span>Electric short</span>
                <StatusBadge status="IN_PROGRESS" />
              </div>
              <div className="flex items-center justify-between">
                <span>Elevator issue</span>
                <StatusBadge status="PENDING" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
