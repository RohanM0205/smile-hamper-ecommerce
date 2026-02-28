"use client";

import Link from "next/link";
import { updateUserRole, toggleUserStatus } from "../actions";

interface User {
  id: string;
  email: string;
  role: string;
  banned_until: string | null;
  total_orders: number;
  total_spent: number;
}

interface Props {
  users: User[];
  page: number;
  totalPages: number;
  search: string;
  roleFilter: string;
}

export default function SuperAdminClient({
  users,
  page,
  totalPages,
  search,
  roleFilter,
}: Props) {
  return (
    <div>
      <h1 className="text-2xl font-serif mb-6">Super Admin Panel</h1>

      {/* FILTERS */}
      <form className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          name="search"
          defaultValue={search}
          placeholder="Search by email..."
          className="px-4 py-2 border rounded-lg"
        />

        <select
          name="role"
          defaultValue={roleFilter}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="super_admin">Super Admin</option>
        </select>

        <button className="px-4 py-2 bg-primary text-white rounded-lg">
          Apply
        </button>

        <Link
          href="/admin/super-admin"
          className="px-4 py-2 border rounded-lg hover:bg-muted"
        >
          Clear
        </Link>
      </form>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border rounded-lg">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Role</th>
              <th className="p-3 text-center">Orders</th>
              <th className="p-3 text-center">Total Spent</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                {/* EMAIL */}
                <td className="p-3">
                  <Link
                    href={`/admin/super-admin/${u.id}`}
                    className="text-primary underline"
                  >
                    {u.email}
                  </Link>
                </td>

                {/* ROLE */}
                <td className="p-3 text-center capitalize">
                  {u.role}
                </td>

                {/* ORDERS */}
                <td className="p-3 text-center">
                  {u.total_orders}
                </td>

                {/* TOTAL SPENT */}
                <td className="p-3 text-center">
                  ₹{Number(u.total_spent).toLocaleString()}
                </td>

                {/* STATUS */}
                <td className="p-3 text-center">
                  {u.banned_until ? (
                    <span className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-full">
                      Disabled
                    </span>
                  ) : (
                    <span className="px-3 py-1 text-xs bg-green-100 text-green-600 rounded-full">
                      Active
                    </span>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="p-3">
                  <div className="flex gap-2 justify-center">

                    {/* PROMOTE */}
                    {u.role === "user" && (
                      <form action={updateUserRole}>
                        <input type="hidden" name="userId" value={u.id} />
                        <input type="hidden" name="newRole" value="admin" />
                        <button className="px-3 py-1 text-sm bg-primary text-white rounded-md">
                          Promote
                        </button>
                      </form>
                    )}

                    {/* DEMOTE */}
                    {u.role === "admin" && (
                      <form action={updateUserRole}>
                        <input type="hidden" name="userId" value={u.id} />
                        <input type="hidden" name="newRole" value="user" />
                        <button className="px-3 py-1 text-sm bg-yellow-600 text-white rounded-md">
                          Demote
                        </button>
                      </form>
                    )}

                    {/* ENABLE / DISABLE */}
                    {u.role !== "super_admin" && (
                      <form action={toggleUserStatus}>
                        <input type="hidden" name="userId" value={u.id} />
                        <input
                          type="hidden"
                          name="currentStatus"
                          value={u.banned_until ?? ""}
                        />
                        <button
                          className={`px-3 py-1 text-sm rounded-md ${
                            u.banned_until
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {u.banned_until ? "Enable" : "Disable"}
                        </button>
                      </form>
                    )}

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex gap-2 mt-6">
        {Array.from({ length: totalPages }, (_, i) => (
          <Link
            key={i}
            href={`/admin/super-admin?page=${i + 1}&search=${search}&role=${roleFilter}`}
            className={`px-3 py-1 border rounded ${
              page === i + 1
                ? "bg-primary text-white"
                : "hover:bg-muted"
            }`}
          >
            {i + 1}
          </Link>
        ))}
      </div>
    </div>
  );
}
