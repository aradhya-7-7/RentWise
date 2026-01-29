import { useMemo, useState } from "react"

import TableWrapper from "@/components/common/TableWrapper"
import StatusBadge from "@/components/common/StatusBadge"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  MoreVertical,
  Shield,
  Users as UsersIcon,
  UserRound,
  Ban,
  CheckCircle2,
} from "lucide-react"

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
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, enabled } : u)))
  }

  const changeUserRole = (id: string, role: Role) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
  }

  const roleIcon = (role: Role) => {
    if (role === "ADMIN") return <Shield className="h-4 w-4 text-[#D4AF37]" />
    if (role === "OWNER") return <UsersIcon className="h-4 w-4 text-white/70" />
    return <UserRound className="h-4 w-4 text-white/70" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            User Management
          </h1>
          <p className="text-sm text-white/60">
            Manage user accounts, roles and access across the platform.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{kpis.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Owners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{kpis.owners}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Tenants
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{kpis.tenants}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-white/70">
              Disabled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{kpis.disabled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, role..."
            className="w-full md:w-[360px]"
          />

          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as any)}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">All roles</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
              <SelectItem value="OWNER">Owner</SelectItem>
              <SelectItem value="TENANT">Tenant</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-white/60">
          Showing{" "}
          <span className="font-medium text-white">{filteredUsers.length}</span>{" "}
          users
        </div>
      </div>

      {/* Table */}
      <TableWrapper title="Users">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Last Login</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                {/* User */}
                <td>
                  <div className="font-medium text-white">{u.name}</div>
                  <div className="text-xs text-white/50">{u.email}</div>
                </td>

                {/* Role */}
                <td>
                  <div className="flex items-center gap-2">
                    {roleIcon(u.role)}

                    {u.role === "ADMIN" ? (
                      <div className="text-xs text-white/60">ADMIN (Locked)</div>
                    ) : (
                      <Select
                        value={u.role}
                        onValueChange={(v) => changeUserRole(u.id, v as Role)}
                      >
                        <SelectTrigger className="h-9 w-[140px]">
                          <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="OWNER">Owner</SelectItem>
                          <SelectItem value="TENANT">Tenant</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td>
                  {u.enabled ? (
                    <StatusBadge status="RESOLVED" />
                  ) : (
                    <StatusBadge status="OVERDUE" />
                  )}
                </td>

                {/* Created */}
                <td className="text-white/60">{u.createdAt}</td>

                {/* Last Login */}
                <td className="text-white/60">{u.lastLogin}</td>

                {/* Actions */}
                <td>
                  <div className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        {u.enabled ? (
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => setUserEnabled(u.id, false)}
                            disabled={u.role === "ADMIN"}
                          >
                            <Ban className="h-4 w-4" />
                            Disable user
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            className="gap-2"
                            onClick={() => setUserEnabled(u.id, true)}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Enable user
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => navigator.clipboard.writeText(u.email)}
                        >
                          Copy email
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td className="py-10 text-center text-white/50" colSpan={6}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </TableWrapper>

      {/* Note */}
      <div className="text-xs text-white/45">
        Note: Role changes and enable/disable are frontend mock actions. Later these will call backend APIs.
      </div>
    </div>
  )
}
