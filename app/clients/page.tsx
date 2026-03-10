"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface Customer {
  id: { tb: string; id: string } | string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

function getId(record: any): string {
  if (typeof record.id === "string") {
    return record.id.includes(":") ? record.id.split(":")[1] : record.id;
  }
  return record.id?.id ?? "";
}

export default function ClientsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  function loadCustomers() {
    setLoading(true);
    apiClient<Customer[]>("/api/protected/customers")
      .then(setCustomers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: load on mount only
  useEffect(() => {
    loadCustomers();
  }, []);

  function resetForm() {
    setForm({ firstName: "", lastName: "", email: "", phone: "", address: "" });
    setShowForm(false);
    setEditingId(null);
  }

  function handleEdit(customer: Customer) {
    setForm({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
    });
    setEditingId(getId(customer));
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      if (editingId) {
        await apiClient(`/api/protected/customers/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiClient("/api/protected/customers", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }
      resetForm();
      loadCustomers();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(customer: Customer) {
    if (!confirm("Supprimer ce client ?")) return;
    try {
      await apiClient(`/api/protected/customers/${getId(customer)}`, {
        method: "DELETE",
      });
      loadCustomers();
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Clients</h1>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 cursor-pointer"
        >
          Ajouter un client
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded p-4 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              placeholder="Prenom"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Nom"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
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
              placeholder="Telephone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Adresse"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="border border-gray-300 rounded px-3 py-2 text-sm md:col-span-2"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 cursor-pointer"
            >
              {editingId ? "Modifier" : "Creer"}
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

      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nom</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Telephone</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={getId(customer)} className="border-b border-gray-100">
                <td className="px-4 py-3">
                  <Link
                    href={`/clients/${getId(customer)}`}
                    className="text-blue-600 hover:underline"
                  >
                    {customer.firstName} {customer.lastName}
                  </Link>
                </td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.phone}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(customer)}
                    className="text-gray-600 hover:text-gray-900 mr-3 cursor-pointer"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(customer)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-500">
                  Aucun client
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
