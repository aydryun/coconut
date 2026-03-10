"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { apiClient } from "@/lib/api-client";

interface UserRecord {
  id: any;
  email: string;
  name: string;
  role: string;
}

function getId(record: any): string {
  if (typeof record.id === "string") {
    return record.id.includes(":") ? record.id.split(":")[1] : record.id;
  }
  return record.id?.id ?? "";
}

export default function AdminUsersPage() {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, isLoading, router]);

  function loadUsers() {
    setLoading(true);
    apiClient<UserRecord[]>("/api/protected/admin/users")
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: load when admin status is confirmed
  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  function resetForm() {
    setForm({ email: "", name: "", password: "", role: "user" });
    setShowForm(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await apiClient("/api/protected/admin/users", {
        method: "POST",
        body: JSON.stringify(form),
      });
      resetForm();
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleRoleChange(user: UserRecord, newRole: string) {
    try {
      await apiClient("/api/protected/admin/users", {
        method: "PUT",
        body: JSON.stringify({ id: getId(user), role: newRole }),
      });
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(user: UserRecord) {
    if (!confirm("Supprimer cet utilisateur ?")) return;
    try {
      await apiClient(`/api/protected/admin/users?id=${getId(user)}`, {
        method: "DELETE",
      });
      loadUsers();
    } catch (err) {
      console.error(err);
    }
  }

  if (isLoading || !isAdmin) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 cursor-pointer"
        >
          Ajouter un utilisateur
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded p-4 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Nom"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Mot de passe"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 cursor-pointer"
            >
              Creer
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="border border-gray-300 px-4 py-2 rounded text-sm hover:bg-gray-100 cursor-pointer"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Chargement...</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Nom</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Role</th>
                <th className="text-left px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={getId(user)} className="border-b border-gray-100">
                  <td className="px-4 py-3">{user.name || "-"}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleDelete(user)}
                      className="text-red-600 hover:text-red-800 cursor-pointer"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    Aucun utilisateur
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
