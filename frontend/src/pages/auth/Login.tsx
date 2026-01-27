import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useAuthStore } from "@/store/auth.store"
import { useToast } from "@/hooks/useToast"
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const { toast, showToast } = useToast()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      await login({ email, password })

      const role = useAuthStore.getState().user?.role

      showToast({
        title: "Welcome back ✅",
        description: `Logged in as ${role}`,
      })

      if (role === "ADMIN") navigate("/admin/dashboard")
      else if (role === "OWNER") navigate("/owner/dashboard")
      else navigate("/tenant/dashboard")
    } catch (err: any) {
      showToast({
        title: "Login failed ❌",
        description: err?.message || "Invalid credentials",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white relative overflow-hidden flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-[420px] w-[420px] rounded-full bg-[#D4AF37]/20 blur-[120px]" />
        <div className="absolute top-[20%] -right-24 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[140px]" />
        <div className="absolute bottom-[-140px] left-[25%] h-[520px] w-[520px] rounded-full bg-purple-500/10 blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        <div className="absolute -inset-2 rounded-[32px] bg-gradient-to-br from-[#D4AF37]/25 to-transparent blur-2xl" />

        <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 shadow-[0_0_40px_rgba(0,0,0,0.45)] backdrop-blur">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#B8922F] shadow-[0_0_20px_rgba(212,175,55,0.25)]" />
            <div className="leading-tight">
              <div className="text-lg font-bold tracking-tight">RentWise</div>
              <div className="text-xs text-white/60">
                Secure Property Portal Login
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold tracking-tight">Login</h1>
            <p className="text-sm text-white/60 mt-1">
              Enter your credentials to access your dashboard.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@demo.com / owner@demo.com"
                className="bg-black/20 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#D4AF37]/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Any password (mock)"
                className="bg-black/20 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#D4AF37]/40"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-[#D4AF37] text-black hover:bg-[#caa434]"
            >
              {loading ? "Signing in..." : "Login"}
            </Button>

            {/* Demo info */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-white/65 leading-relaxed">
              <div className="font-semibold text-white/80 mb-1">Demo Accounts</div>
              <div>Admin: <b className="text-white">admin@demo.com</b></div>
              <div>Owner: <b className="text-white">owner@demo.com</b></div>
              <div>Tenant: any email</div>
            </div>

            <div className="text-center text-sm text-white/65">
              Don’t have an account?{" "}
              <Link to="/register" className="text-[#D4AF37] hover:underline">
                Register
              </Link>
            </div>

            <div className="text-center text-xs text-white/50">
              <Link to="/" className="hover:text-white/70">
                ← Back to Home
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[300]">
          <Toast open>
            <div>
              <ToastTitle>{toast.title}</ToastTitle>
              {toast.description && (
                <ToastDescription>{toast.description}</ToastDescription>
              )}
            </div>
          </Toast>
        </div>
      )}
    </div>
  )
}
