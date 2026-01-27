import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-[420px] w-[420px] rounded-full bg-[#D4AF37]/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-24 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[140px]" />
        <div className="absolute bottom-[-140px] left-[25%] h-[520px] w-[520px] rounded-full bg-purple-500/10 blur-[150px]" />

        {/* subtle grid */}
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      {/* Top Nav */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F14]/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8922F] shadow-[0_0_20px_rgba(212,175,55,0.25)]" />
            <div className="leading-tight">
              <div className="font-bold tracking-tight text-lg">RentWise</div>
              <div className="text-xs text-white/60">
                Property Management Platform
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="border-white/15 bg-white/5 text-white hover:bg-white/10"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
            <Button
              className="bg-[#D4AF37] text-black hover:bg-[#caa434]"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Left */}
            <motion.div
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.6 }}
              variants={fadeUp}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
                CREM-inspired premium portal
              </div>

              <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
                Luxury-grade property management.
                <span className="block text-[#D4AF37]">
                  Built for owners, loved by tenants.
                </span>
              </h1>

              <p className="text-white/70 text-base md:text-lg leading-relaxed">
                Manage rentals, leases, payments and maintenance workflows with
                role-based access. A modern platform designed to feel premium,
                fast and professional.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  className="h-11 bg-[#D4AF37] text-black hover:bg-[#caa434]"
                  onClick={() => navigate("/login")}
                >
                  Enter Platform
                </Button>

                <Button
                  variant="outline"
                  className="h-11 border-white/15 bg-white/5 text-white hover:bg-white/10"
                  onClick={() => navigate("/register")}
                >
                  Create Account
                </Button>
              </div>

              <div className="text-xs text-white/55 leading-relaxed">
                Demo: <b className="text-white">admin@demo.com</b> •{" "}
                <b className="text-white">owner@demo.com</b> • any email for
                tenant
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
                  <div className="text-2xl font-bold">92%</div>
                  <div className="text-xs text-white/60 mt-1">
                    Rent collected
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
                  <div className="text-2xl font-bold">2.1d</div>
                  <div className="text-xs text-white/60 mt-1">Avg resolve</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs text-white/60 mt-1">Tenant portal</div>
                </div>
              </div>
            </motion.div>

            {/* Right: Feature Card */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -inset-2 rounded-[28px] bg-gradient-to-br from-[#D4AF37]/20 to-transparent blur-2xl" />

              <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/70">
                    Live platform preview
                  </div>
                  <div className="text-xs rounded-full border border-white/10 bg-black/30 px-3 py-1 text-white/60">
                    Enterprise UI
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {[
                    {
                      title: "Owner Dashboard",
                      desc: "Rent ledger, tenant directory, unit drill-down",
                    },
                    {
                      title: "Tenant Portal",
                      desc: "Pay now, lease details, maintenance tickets",
                    },
                    {
                      title: "Admin Console",
                      desc: "KPIs, user management, property monitoring",
                    },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4 hover:bg-black/30 transition"
                    >
                      <div className="font-semibold">{item.title}</div>
                      <div className="text-xs text-white/60 mt-1">
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button
                    className="bg-white text-black hover:bg-white/90"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Image Section */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          {/* Left text */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span className="h-2 w-2 rounded-full bg-[#D4AF37]" />
              Premium Managed Properties
            </div>

            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              A modern experience for premium rentals
            </h2>

            <p className="text-sm md:text-base text-white/65 leading-relaxed">
              Designed for property owners who want clean operations and tenants
              who want clarity. Manage occupancy, leases, payments, and service
              tickets with a refined enterprise interface.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2 text-sm">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
                <div className="font-semibold text-white">Luxury UI</div>
                <div className="text-xs text-white/60 mt-1">
                  CREM-inspired theme
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition">
                <div className="font-semibold text-white">Role Access</div>
                <div className="text-xs text-white/60 mt-1">
                  Admin / Owner / Tenant
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right images */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="relative"
          >
            <div className="absolute -inset-3 rounded-[32px] bg-gradient-to-br from-[#D4AF37]/25 to-transparent blur-2xl" />

            <div className="relative grid grid-cols-12 gap-3">
              {/* Main image */}
              <div className="relative col-span-12 md:col-span-7 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 hover:border-white/20 transition">
                <img
                  src="/images/estate-1.jpg"
                  alt="Luxury property"
                  className="h-[260px] md:h-[360px] w-full object-cover transition duration-700 hover:scale-[1.06] hover:brightness-110"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              </div>

              {/* Right stacked */}
              <div className="col-span-12 md:col-span-5 grid gap-3">
                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 hover:border-white/20 transition">
                  <img
                    src="/images/estate-2.jpg"
                    alt="Modern apartment"
                    className="h-[170px] md:h-[172px] w-full object-cover transition duration-700 hover:scale-[1.06] hover:brightness-110"
                  />
                </div>

                <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 hover:border-white/20 transition relative">
                  <img
                    src="/images/estate-3.jpg"
                    alt="Premium interior"
                    className="h-[170px] md:h-[172px] w-full object-cover transition duration-700 hover:scale-[1.06] hover:brightness-110"
                  />

                  <div className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/75 backdrop-blur">
                    Managed • Verified • Secure
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          variants={fadeUp}
          className="flex items-end justify-between gap-6"
        >
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Services that feel premium
            </h2>
            <p className="text-sm text-white/65 mt-2 max-w-2xl">
              Your rental operations deserve something better than spreadsheets
              and WhatsApp chaos.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-4 mt-8 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "Lease Management",
              desc: "Lease terms, renewals, and downloadable contract access.",
            },
            {
              title: "Rent Collection",
              desc: "Track paid/pending/overdue with full payment history.",
            },
            {
              title: "Maintenance Workflow",
              desc: "Tickets with priority, statuses and resolution timeline.",
            },
            {
              title: "Owner Analytics",
              desc: "Financial KPIs and collection performance at a glance.",
            },
            {
              title: "Tenant Experience",
              desc: "Pay now, ticket raising, and lease details in one place.",
            },
            {
              title: "Admin Governance",
              desc: "Control user access, monitor platform health and usage.",
            },
          ].map((s) => (
            <div
              key={s.title}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
            >
              <div className="h-10 w-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/20 flex items-center justify-center">
                <div className="h-2 w-2 rounded-full bg-[#D4AF37]" />
              </div>

              <div className="mt-4 font-semibold">{s.title}</div>
              <div className="text-sm text-white/65 mt-2 leading-relaxed">
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-8 md:p-10">
          <h3 className="text-xl md:text-2xl font-bold tracking-tight">
            Simple process. Serious results.
          </h3>

          <div className="grid gap-4 mt-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Setup roles",
                desc: "Admin/Owner/Tenant accounts with permissions.",
              },
              {
                step: "02",
                title: "Manage rentals",
                desc: "Properties, units, tenants, leases and collection.",
              },
              {
                step: "03",
                title: "Track operations",
                desc: "Payments, tickets, dashboards, insights.",
              },
            ].map((p) => (
              <div
                key={p.step}
                className="rounded-3xl border border-white/10 bg-black/20 p-5 hover:bg-black/30 transition"
              >
                <div className="text-[#D4AF37] font-bold">{p.step}</div>
                <div className="mt-2 font-semibold">{p.title}</div>
                <div className="text-sm text-white/65 mt-2">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Trusted by real humans
        </h2>
        <p className="text-sm text-white/65 mt-2 max-w-2xl">
          The platform feels clean, premium, and reliable — exactly how property
          management should be.
        </p>

        <div className="grid gap-4 mt-8 md:grid-cols-3">
          {[
            {
              name: "Rahul Mehta",
              role: "Owner",
              quote:
                "Rent ledger and maintenance tickets made my operations 10x smoother. It looks premium too.",
            },
            {
              name: "Aman Sharma",
              role: "Tenant",
              quote:
                "Paying rent + tracking tickets in one portal feels like modern banking. No confusion.",
            },
            {
              name: "Neha Verma",
              role: "Admin",
              quote:
                "I can monitor the entire platform easily. KPIs + user management = chef’s kiss.",
            },
          ].map((t) => (
            <div
              key={t.name}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
            >
              <div className="text-sm text-white/80 leading-relaxed">
                “{t.quote}”
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-white/60">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-[36px] border border-white/10 bg-gradient-to-br from-[#D4AF37]/25 to-white/5 p-8 md:p-12 overflow-hidden relative">
          <div className="absolute right-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-[#D4AF37]/20 blur-[100px]" />

          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                Ready to upgrade your rental operations?
              </h3>
              <p className="text-sm text-white/70 mt-3 max-w-xl">
                Launch your role-based platform and give users an experience
                that feels premium, clean, and fast.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
              <Button
                className="h-11 bg-[#D4AF37] text-black hover:bg-[#caa434]"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                className="h-11 border-white/15 bg-white/5 text-white hover:bg-white/10"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-10 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <div className="font-bold text-lg">RentWise</div>
            <div className="text-sm text-white/60 max-w-md">
              A CREM-inspired property management platform built with React,
              Tailwind and shadcn UI.
            </div>
          </div>

          <div className="md:text-right text-sm text-white/60 space-y-2">
            <div>Role-based dashboards</div>
            <div>Rent ledger + payments</div>
            <div>Maintenance tickets</div>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/50 flex items-center justify-between">
            <div>© {new Date().getFullYear()} RentWise</div>
            <div>Built for enterprise UX</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
