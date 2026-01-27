import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ChartCard from "@/components/charts/ChartCard"
import StatusBadge from "@/components/common/StatusBadge"
import TableWrapper from "@/components/common/TableWrapper"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type ActivityStatus = "PAID" | "PENDING" | "OVERDUE" | "RESOLVED" | "IN_PROGRESS" | "URGENT"

export default function Dashboard() {
  // ✅ KPI data (later from backend)
  const kpis = [
    { label: "Total Units", value: 42, hint: "6 vacant units" },
    { label: "Rent Collected", value: "₹ 6.2L", hint: "This month" },
    { label: "Overdue", value: "₹ 58k", hint: "4 tenants" },
    { label: "Open Tickets", value: 7, hint: "2 urgent" },
  ]

  // ✅ charts
  const incomeData = [
    { month: "Aug", income: 460000 },
    { month: "Sep", income: 510000 },
    { month: "Oct", income: 560000 },
    { month: "Nov", income: 590000 },
    { month: "Dec", income: 570000 },
    { month: "Jan", income: 620000 },
  ]

  const occupancyData = [
    { month: "Aug", occupied: 34, vacant: 8 },
    { month: "Sep", occupied: 35, vacant: 7 },
    { month: "Oct", occupied: 36, vacant: 6 },
    { month: "Nov", occupied: 37, vacant: 5 },
    { month: "Dec", occupied: 38, vacant: 4 },
    { month: "Jan", occupied: 36, vacant: 6 },
  ]

  const paymentSplit = [
    { name: "Paid", value: 32 },
    { name: "Overdue", value: 4 },
    { name: "Pending", value: 6 },
  ]

  const pieColors = ["#D4AF37", "#ef4444", "#f59e0b"] // gold, red, amber

  const recent = [
    {
      id: "p1",
      tenant: "Aman Sharma",
      unit: "Skyline • A-202",
      amount: "₹ 18,500",
      date: "Today, 10:20 AM",
      status: "PAID" as ActivityStatus,
    },
    {
      id: "p2",
      tenant: "Ravi Singh",
      unit: "Skyline • B-104",
      amount: "₹ 19,000",
      date: "Yesterday, 6:15 PM",
      status: "PENDING" as ActivityStatus,
    },
    {
      id: "p3",
      tenant: "Neha Verma",
      unit: "Green Valley • 3B-09",
      amount: "₹ 21,000",
      date: "Yesterday, 2:10 PM",
      status: "OVERDUE" as ActivityStatus,
    },
  ]

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Owner Dashboard
          </h1>
          <p className="text-sm text-white/60">
            Rent performance, occupancy and operations overview.
          </p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <Card
            key={kpi.label}
            className="border-white/10 bg-white/5 text-white hover:bg-white/10 transition"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-white/70">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}</div>
              <p className="text-xs text-white/55 mt-1">{kpi.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* income chart */}
        <ChartCard
          title="Monthly Rent Income"
          subtitle="Income trend across last 6 months"
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={incomeData}>
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.35)" />
                <YAxis stroke="rgba(255,255,255,0.35)" />
                <Tooltip
                  contentStyle={{
                    background: "#0F1622",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 14,
                    color: "white",
                  }}
                  labelStyle={{ color: "rgba(255,255,255,0.7)" }}
                />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#D4AF37"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* payments split */}
        <ChartCard title="Payment Status Split" subtitle="Paid vs Pending vs Overdue">
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentSplit}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={4}
                >
                  {paymentSplit.map((_, idx) => (
                    <Cell key={idx} fill={pieColors[idx]} />
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

          <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-white/60">Paid</div>
              <div className="text-white font-semibold">{paymentSplit[0].value}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-white/60">Overdue</div>
              <div className="text-white font-semibold">{paymentSplit[1].value}</div>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-white/60">Pending</div>
              <div className="text-white font-semibold">{paymentSplit[2].value}</div>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* occupancy chart + recent payments */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartCard
            title="Occupancy vs Vacancy"
            subtitle="Units occupied and vacant by month"
          >
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={occupancyData}>
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.35)" />
                  <YAxis stroke="rgba(255,255,255,0.35)" />
                  <Tooltip
                    contentStyle={{
                      background: "#0F1622",
                      border: "1px solid rgba(255,255,255,0.12)",
                      borderRadius: 14,
                      color: "white",
                    }}
                  />
                  <Bar dataKey="occupied" fill="#D4AF37" radius={[10, 10, 0, 0]} />
                  <Bar dataKey="vacant" fill="rgba(255,255,255,0.18)" radius={[10, 10, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        {/* Recent payments */}
        <div className="space-y-4">
          <TableWrapper title="Recent Payments">
            <table className="w-full text-sm">
              <thead className="bg-white/5">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-white/70">
                    Tenant
                  </th>
                  <th className="px-4 py-3 font-medium text-white/70">Amount</th>
                  <th className="px-4 py-3 font-medium text-white/70">Status</th>
                </tr>
              </thead>

              <tbody>
                {recent.map((r) => (
                  <tr key={r.id} className="border-t border-white/10">
                    <td className="px-4 py-3">
                      <div className="font-medium text-white">{r.tenant}</div>
                      <div className="text-xs text-white/55">{r.unit}</div>
                      <div className="text-xs text-white/45">{r.date}</div>
                    </td>

                    <td className="px-4 py-3 text-white/80">{r.amount}</td>

                    <td className="px-4 py-3">
                      <StatusBadge status={r.status as any} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableWrapper>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-sm">
            <div className="font-semibold text-white">Owner Tip</div>
            <p className="text-white/60 mt-2 leading-relaxed">
              Focus on tenants with repeated overdue history and introduce auto-reminders.
              It improves collections drastically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
