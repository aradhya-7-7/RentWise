import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="font-bold text-lg tracking-tight">
            RentWise <span className="text-muted-foreground font-medium">| Property Platform</span>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button onClick={() => navigate("/register")}>Register</Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-20">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-5">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Enterprise-grade Property Management Platform
            </h1>

            <p className="text-muted-foreground text-base md:text-lg">
              Manage properties, leases, rent collection, payments and maintenance requests —
              with role-based access for Admin, Owner and Tenant.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="h-11" onClick={() => navigate("/login")}>
                Get Started
              </Button>
              <Button className="h-11" variant="outline" onClick={() => navigate("/register")}>
                Create Account
              </Button>
            </div>

            <div className="text-xs text-muted-foreground">
              Demo accounts: admin@demo.com • owner@demo.com • (any email for tenant)
            </div>
          </div>

          {/* Hero right card */}
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Platform Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start justify-between gap-4 border rounded-xl p-3">
                <div>
                  <div className="font-semibold">Admin Console</div>
                  <div className="text-muted-foreground text-xs">
                    KPI overview + user & property monitoring
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate("/login")}>
                  View
                </Button>
              </div>

              <div className="flex items-start justify-between gap-4 border rounded-xl p-3">
                <div>
                  <div className="font-semibold">Owner Dashboard</div>
                  <div className="text-muted-foreground text-xs">
                    rent ledger + units + maintenance tickets
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate("/login")}>
                  View
                </Button>
              </div>

              <div className="flex items-start justify-between gap-4 border rounded-xl p-3">
                <div>
                  <div className="font-semibold">Tenant Portal</div>
                  <div className="text-muted-foreground text-xs">
                    pay rent + lease + maintenance request
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => navigate("/login")}>
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-6">
          Everything you need to manage rentals
        </h2>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Role Based Access</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Separate Admin, Owner and Tenant portals with protected routes.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rent Ledger</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Track paid/pending/overdue payments with totals and filters.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Maintenance Tickets</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Ticket workflow with status updates, priority and tracking.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Unit Management</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Properties with unit drill-down, vacancy visibility and occupancy summary.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Enterprise UI</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Clean tables, KPI cards, dashboard layout and consistent design system.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Backend Ready</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Services layer supports mock + real API switching.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} RentWise. All rights reserved.</div>
          <div>Built with React + Tailwind + shadcn UI</div>
        </div>
      </footer>
    </div>
  )
}
