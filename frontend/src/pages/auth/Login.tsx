import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toast, ToastDescription, ToastTitle } from "@/components/ui/toast";

import { useAuthStore } from "@/store/auth.store";
import type { Role } from "@/types/user";
import { useToast } from "@/hooks/useToast";

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const { toast, showToast } = useToast();

  const [email, setEmail] = useState("admin@demo.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const redirectByRole = (role: Role) => {
    if (role === "ADMIN") navigate("/admin/dashboard");
    if (role === "OWNER") navigate("/owner/dashboard");
    if (role === "TENANT") navigate("/tenant/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);

      // Infer role based on email in mock mode
      const role: Role = email.includes("admin")
        ? "ADMIN"
        : email.includes("owner")
          ? "OWNER"
          : "TENANT";

      showToast({
        title: "Login successful",
        description: `Welcome back! Logged in as ${role}`,
      });

      setTimeout(() => redirectByRole(role), 500);
    } catch (err: any) {
      showToast({
        title: "Login failed ",
        description: err?.message || "Invalid credentials",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md rounded-2xl border p-6 shadow-sm space-y-5">
        <div>
          <h1 className="text-2xl font-bold">Login</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your dashboard.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@demo.com"
              type="email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
              required
            />
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 underline">
              Register
            </Link>
          </p>

          <div className="text-xs text-muted-foreground text-center">
            Demo emails: admin@demo.com / owner@demo.com / tenant@demo.com
          </div>
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
  );
}
