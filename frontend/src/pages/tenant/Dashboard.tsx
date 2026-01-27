import { useNavigate } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ChartCard from "@/components/charts/ChartCard"
import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type ActivityStatus = "PAID" | "PENDING" | "OVERDUE" | "RESOLVED" | "IN_PROGRESS" | "URGENT"

export default function Dashboard() {
  const navigate = useNavigate()

  // ✅ tenant kpis
  const kpis = [
    { label: "Current Rent", value: "₹ 18,500", hint: "Due on 5th Feb" },
    { label: "Status", value: "Pending", hint: "Pay to avoid overdue" },
    { label: "On-time Streak", value: "5 months", hint: "Great reliability" },
    { label: "Open Tickets", value: 2, hint: "1 urgent" },
  ]

  // ✅ charts data
  const rentTrend = [
    { month: "Aug", paid: 1 },
    { month: "Sep", paid: 1 },
    { month: "Oct", paid: 1 },
    { month: "Nov", paid: 1 },
    { month: "Dec", paid: 1 },
    { month: "Jan", paid: 0 }, // current month unpaid
  ]

  const ticketsSplit = [
    { name: "Resolved", value: 6 },
    { name: "In Progress", value: 2 },
    { name: "Pending", value: 1 },
  ]

  const colors = ["#D4AF37", "#60a5fa", "rgba(255,255,255,0.18)"]

  const recent = [
    {
      id: "t1",
      title: "Rent due for January",
      subtitle: "Skyline Residency • Unit A-202",
      date: "Today",
      status: "PENDING" as ActivityStatus,
    },
    {
      id: "t2",
      title: "Maintenance update",
      subtitle: "Ticket: Water leakage — Assigned to technician",
      date: "Yesterday",
      status: "IN_PROGRESS" as ActivityStatus,
    },
    {
      id: "t3",
      title: "Payment successful",
      subtitle: "₹ 18,500 • December rent",
      date: "Last week",
      status: "PAID" as ActivityStatus,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Tenant Dashboard
          </h1>
          <p className="text-sm text-white/60">
            Your lease, rent payments and maintenance updates — all in one place.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-[#D4AF37] text-black hover:bg-[#caa434]"
            onClick={() => navigate("/tenant/payments")}
          >
            Pay Now
          </Button>

          <Button
            variant="outline"
            className="border-white/15 bg-white/5 text-white hover:bg-white/10"
            onClick={() => navigate("/tenant/maintenance")}
          >
            Submit Ticket
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{kpi.value}</div>
              <p className="text-xs text-white/55 mt-1">{kpi.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Rent payment timeline */}
        <ChartCard
          title="Rent Payment Timeline"
          subtitle="Paid months vs current pending"
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rentTrend}>
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.35)" />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "#0F1622",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 14,
                    color: "white",
                  }}
                />
                <Bar
                  dataKey="paid"
                  fill="#D4AF37"
                  radius={[10, 10, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="mt-3 text-sm text-white/60">
            Tip: maintain your on-time streak to improve rental reliability score.
          </p>
        </ChartCard>

        {/* Maintenance ticket split */}
        <ChartCard title="Maintenance Ticket Status" subtitle="Last 3 months">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ticketsSplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={4}
                >
                  {ticketsSplit.map((_, idx) => (
                    <Cell key={idx} fill={colors[idx]} />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    background: "#0F1622",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 14,
                    color: "white",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-white/60">Resolved</div>
              <div className="text-white font-semibold">{ticketsSplit[0].value}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-white/60">In Progress</div>
              <div className="text-white font-semibold">{ticketsSplit[1].value}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-white/60">Pending</div>
              <div className="text-white font-semibold">{ticketsSplit[2].value}</div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TableWrapper title="Recent Updates">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-white/70">
                    Update
                  </th>
                  <th className="px-4 py-3 font-medium text-white/70">Date</th>
                  <th className="px-4 py-3 font-medium text-white/70">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-t border-white/10">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{r.title}</div>
                      <div className="text-xs text-white/55">{r.subtitle}</div>
                    </td>
                    <td className="px-4 py-3 text-white/60">{r.date}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={r.status as any} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>
        </div>

        {/* Side card */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base text-white">Your Lease</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/60">Property</span>
                <span className="font-semibold text-white">Skyline Residency</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Unit</span>
                <span className="font-semibold text-white">A-202</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Lease Ends</span>
                <span className="font-semibold text-white">28 Nov 2026</span>
              </div>

              <Button
                variant="outline"
                className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10 mt-2"
                onClick={() => navigate("/tenant/lease")}
              >
                View Lease Details
              </Button>
            </CardContent>
          </Card>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm">
            <div className="font-semibold text-white">Tenant Tip</div>
            <p className="text-white/60 mt-2 leading-relaxed">
              Pay rent before due date to maintain your on-time streak and avoid late fees.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
