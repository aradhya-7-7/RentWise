import { useMemo, useState } from "react"

import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Role = "ADMIN" | "OWNER" | "TENANT"

type UserRow = {
  id: string
  name: string
  email: string
  role: Role
  enabled: boolean
  createdAt: string
  lastLogin: string
}

export default function Users() {
  // ✅ Replace later with API call: adminService.listUsers()
  const [users, setUsers] = useState<UserRow[]>([
    {
      id: "u1",
      name: "Admin User",
      email: "admin@demo.com",
      role: "ADMIN",
      enabled: true,
      createdAt: "2025-12-21",
      lastLogin: "2026-01-14",
    },
    {
      id: "u2",
      name: "Raj Gupta",
      email: "raj.owner@gmail.com",
      role: "OWNER",
      enabled: true,
      createdAt: "2025-12-27",
      lastLogin: "2026-01-13",
    },
    {
      id: "u3",
      name: "Neha Verma",
      email: "neha.tenant@gmail.com",
      role: "TENANT",
      enabled: true,
      createdAt: "2025-12-30",
      lastLogin: "2026-01-10",
    },
    {
      id: "u4",
      name: "Ravi Singh",
      email: "ravi.tenant@gmail.com",
      role: "TENANT",
      enabled: false,
      createdAt: "2025-12-18",
      lastLogin: "2025-12-28",
    },
  ])

  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL")

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase()

    return users
      .filter((u) => (roleFilter === "ALL" ? true : u.role === roleFilter))
      .filter((u) => {
        if (!q) return true
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q)
        )
      })
  }, [users, query, roleFilter])

  const kpis = useMemo(() => {
    const total = users.length
    const owners = users.filter((u) => u.role === "OWNER").length
    const tenants = users.filter((u) => u.role === "TENANT").length
    const disabled = users.filter((u) => !u.enabled).length

    return { total, owners, tenants, disabled }
  }, [users])

  const setUserEnabled = (id: string, enabled: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, enabled } : u))
    )
  }

  const changeUserRole = (id: string, role: Role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage user accounts, roles and access across the platform.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Owners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.owners}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Tenants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.tenants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Disabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpis.disabled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex gap-3 items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, role..."
            className="w-full md:w-[320px]"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="ALL">All roles</option>
            <option value="ADMIN">Admin</option>
            <option value="OWNER">Owner</option>
            <option value="TENANT">Tenant</option>
          </select>
        </div>

        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{filteredUsers.length}</span> users
        </div>
      </div>

      {/* Table */}
      <TableWrapper title="Users">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Last Login</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id} className="border-t">
                {/* User */}
                <td className="px-4 py-3">
                  <div className="font-medium">{u.name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                </td>

                {/* Role */}
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeUserRole(u.id, e.target.value as Role)}
                    className="h-9 rounded-md border border-input bg-background px-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    disabled={u.role === "ADMIN"} // ✅ Admin role locked
                    title={
                      u.role === "ADMIN"
                        ? "Admin role cannot be changed"
                        : "Change user role"
                    }
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="OWNER">Owner</option>
                    <option value="TENANT">Tenant</option>
                  </select>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  {u.enabled ? (
                    <StatusBadge status="RESOLVED" />
                  ) : (
                    <StatusBadge status="OVERDUE" />
                  )}
                </td>

                {/* Created */}
                <td className="px-4 py-3 text-muted-foreground">{u.createdAt}</td>

                {/* Last Login */}
                <td className="px-4 py-3 text-muted-foreground">{u.lastLogin}</td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    {u.enabled ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setUserEnabled(u.id, false)}
                        disabled={u.role === "ADMIN"} // ✅ don't disable admin
                        title={u.role === "ADMIN" ? "Admin cannot be disabled" : "Disable user"}
                      >
                        Disable
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setUserEnabled(u.id, true)}
                      >
                        Enable
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-muted-foreground" colSpan={6}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableWrapper>

      {/* Note */}
      <div className="text-xs text-muted-foreground">
        Note: Role changes and enable/disable are currently frontend mock actions.
        Later these will call backend APIs.
      </div>
    </div>
  )
}
