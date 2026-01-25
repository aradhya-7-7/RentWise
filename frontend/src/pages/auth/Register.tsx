import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast"

import { useToast } from "@/hooks/useToast"
import { authService } from "@/services/auth.service"
import type { Role } from "@/types/user"

export default function Register() {
  const navigate = useNavigate()
  const { toast, showToast } = useToast()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("TENANT")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const validate = () => {
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters"
    }

    if (!email.includes("@") || !email.includes(".")) {
      return "Enter a valid email"
    }

    if (role === "ADMIN") {
      return "You cannot register as Admin"
    }

    if (password.length < 6) {
      return "Password must be at least 6 characters"
    }

    if (password !== confirmPassword) {
      return "Passwords do not match"
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const error = validate()
    if (error) {
      showToast({ title: "Invalid form ", description: error })
      return
    }

    setLoading(true)
    try {
      await authService.register({
        name,
        email,
        password,
        role,
      })

      showToast({
        title: "Account created ",
        description: `Registered as ${role}. Please login.`,
      })

      setTimeout(() => navigate("/login"), 800)
    } catch (err: any) {
      showToast({
        title: "Registration failed ",
        description: err?.message || "Something went wrong",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Create account</h1>
          <p className="text-sm text-muted-foreground">
            Register as Owner or Tenant to access the platform.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              type="text"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              type="email"
              required
            />
          </div>

          {/* Role */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Register As</label>

            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {/* Admin is intentionally not available */}
              <option value="TENANT">Tenant</option>
              <option value="OWNER">Owner</option>
            </select>

            <p className="text-xs text-muted-foreground">
              Admin accounts are created only by the system.
            </p>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              type="password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <Input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              type="password"
              required
            />
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 underline">
              Login
            </Link>
          </p>
        </form>
      </div>

      {/* Toast UI */}
      {toast && (
        <div className="fixed top-4 right-4 z-[200]">
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
