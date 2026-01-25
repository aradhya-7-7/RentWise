import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useAuthStore } from "@/store/auth.store";
import { useToast } from "@/hooks/useToast";
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import { Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const { toast, showToast } = useToast();

  const login = useAuthStore((s) => s.login);
  const user = useAuthStore((s) => s.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await login({ email, password });

      const role = useAuthStore.getState().user?.role;

      showToast({
        title: "Login successful ✅",
        description: `Welcome back (${role})`,
      });

      // ✅ role based redirect
      if (role === "ADMIN") navigate("/admin/dashboard");
      else if (role === "OWNER") navigate("/owner/dashboard");
      else navigate("/tenant/dashboard");
    } catch (err: any) {
      showToast({
        title: "Login failed ❌",
        description: err?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Login</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to continue.</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@demo.com / owner@demo.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Any password (mock login)"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            <div className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-primary hover:underline"
              >
                Register
              </Link>
            </div>

            <div className="text-xs text-muted-foreground pt-2">
              Demo logins:
              <br />
              Admin → <b>admin@demo.com</b>
              <br />
              Owner → <b>owner@demo.com</b>
              <br />
              Tenant → any other email
            </div>
          </form>
        </CardContent>
      </Card>

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
  );
}
