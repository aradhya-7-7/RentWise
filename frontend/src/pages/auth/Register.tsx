import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useAuthStore } from "@/store/auth.store"
import { useToast } from "@/hooks/useToast"
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast"
import { api } from "@/services/api"

type SelectRole = "OWNER" | "TENANT"

/* ================= PASSWORD HELPERS ================= */

const getPasswordStrength = (password: string) => {
  let score = 0

  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[!@#$%^&*]/.test(password)) score++

  return score
}

const passwordChecks = (password: string) => ({
  length: password.length >= 8,
  upper: /[A-Z]/.test(password),
  lower: /[a-z]/.test(password),
  number: /[0-9]/.test(password),
  special: /[!@#$%^&*]/.test(password),
})

export default function Register() {
  const navigate = useNavigate()
  const register = useAuthStore((s) => s.register)
  const { toast, showToast } = useToast()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [role, setRole] = useState<SelectRole>("TENANT")
  const [loading, setLoading] = useState(false)

  const [gender, setGender] = useState<"MALE" | "FEMALE" | "OTHER">("MALE")
  const [aadharFile, setAadharFile] = useState<File | null>(null)

  /* Sexy password states */
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const checks = passwordChecks(password)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      await register({
        name,
        email,
        password,
        role,
        gender,
        aadharFile,
      })

      showToast({
        title: "Account created ✅",
        description: `Registered as ${role}`,
      })

      if (role === "OWNER") navigate("/owner/dashboard")
      else navigate("/tenant/dashboard")
    } catch (err: any) {
      showToast({
        title: "Registration failed ❌",
        description: err?.message || "Please check inputs",
      })
    } finally {
      setLoading(false)
    }

    if (getPasswordStrength(password) < 4) {
      showToast({
        title: "Weak password ❌",
        description: "Please create a stronger password.",
      })
      return
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
                Create your portal account
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold tracking-tight">Register</h1>
            <p className="text-sm text-white/60 mt-1">
              Create an Owner or Tenant account.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-white/80">Full name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="bg-black/20 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#D4AF37]/40"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-black/20 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#D4AF37]/40"
              />
            </div>

            {/* PASSWORD (SEXY VERSION — FIXED ALIGNMENT) */}
            <div className="space-y-2">

              <label className="text-sm text-white/80">Password</label>

              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    const val = e.target.value
                    setPassword(val)
                    setPasswordStrength(getPasswordStrength(val))
                  }}
                  placeholder="Strong password required"
                  className="bg-black/20 border-white/10 text-white placeholder:text-white/40 focus-visible:ring-[#D4AF37]/40 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/60 hover:text-white"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {/* Strength Bar */}
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${passwordStrength * 20}%`,
                    background:
                      passwordStrength <= 2
                        ? "#ef4444"
                        : passwordStrength <= 4
                          ? "#f59e0b"
                          : "#22c55e",
                  }}
                />
              </div>

              {/* Requirement Checklist */}
              <div className="text-xs space-y-1">
                {[
                  ["Minimum 8 characters", checks.length],
                  ["Uppercase letter", checks.upper],
                  ["Lowercase letter", checks.lower],
                  ["Number", checks.number],
                  ["Special character", checks.special],
                ].map(([label, ok]) => (
                  <div
                    key={label as string}
                    className={ok ? "text-green-400" : "text-white/40"}
                  >
                    {ok ? "✓" : "•"} {label}
                  </div>
                ))}
              </div>

            </div>
            {/* Gender */}
            <div className="space-y-2">
              <label className="text-sm text-white/80">Gender</label>

              <div className="grid grid-cols-3 gap-3">
                {["MALE", "FEMALE", "OTHER"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g as any)}
                    className={`rounded-xl border py-2 text-sm transition ${gender === g
                      ? "border-[#D4AF37]/60 bg-[#D4AF37]/10 text-white"
                      : "border-white/10 bg-black/20 text-white/70 hover:bg-black/30"
                      }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            {/* Aadhaar Upload */}
            <div className="space-y-2">
              <label className="text-sm text-white/80">
                Aadhaar Card (Verification)
              </label>

              <label className="flex flex-col items-center justify-center border border-white/10 rounded-2xl bg-black/20 hover:bg-black/30 transition cursor-pointer p-4 text-center">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) setAadharFile(file)
                  }}
                />

                <span className="text-sm text-white/70">
                  {aadharFile ? aadharFile.name : "Upload Aadhaar document"}
                </span>

                <span className="text-xs text-white/40 mt-1">
                  JPG, PNG or PDF allowed
                </span>
              </label>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm text-white/80">Role</label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("OWNER")}
                  className={`rounded-2xl border p-4 text-left transition ${role === "OWNER"
                    ? "border-[#D4AF37]/50 bg-[#D4AF37]/10"
                    : "border-white/10 bg-black/20 hover:bg-black/30"
                    }`}
                >
                  <div className="font-semibold">Owner</div>
                  <div className="text-xs text-white/60 mt-1">
                    Manage properties, tenants & rent ledger
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("TENANT")}
                  className={`rounded-2xl border p-4 text-left transition ${role === "TENANT"
                    ? "border-[#D4AF37]/50 bg-[#D4AF37]/10"
                    : "border-white/10 bg-black/20 hover:bg-black/30"
                    }`}
                >
                  <div className="font-semibold">Tenant</div>
                  <div className="text-xs text-white/60 mt-1">
                    Pay rent, view lease, raise tickets
                  </div>
                </button>
              </div>

              <div className="text-[11px] text-white/50">
                Admin accounts are created internally for security reasons.
              </div>
            </div>


            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={loading || passwordStrength < 4}
              className="w-full"
            >
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm text-white/65">
              Already have an account?{" "}
              <Link to="/login" className="text-[#D4AF37] hover:underline">
                Login
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
          <Toast open className="bg-[#0B0F14] border border-white/10 text-white">

            <div>
              <ToastTitle className="text-white font-semibold">
                {toast.title}
              </ToastTitle>

              {toast.description && (
                <ToastDescription className="text-white/70">
                  {toast.description}
                </ToastDescription>
              )}
            </div>

          </Toast>
        </div>
      )}
    </div>
  )
}
