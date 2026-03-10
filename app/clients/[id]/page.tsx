"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface Customer {
  id: any;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
}

interface Order {
  id: any;
  status: string;
  date: string;
  products: { product: any; quantity: number }[];
}

function formatStatus(status: string): string {
  if (status === "livree") return "Livrée";
  if (status === "en cours") return "En cours";
  return status;
}

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient<Customer>(`/api/protected/customers/${id}`),
      apiClient<Order[]>(`/api/protected/orders?customerId=${id}`),
    ])
      .then(([cust, customerOrders]) => {
        setCustomer(cust);
        setOrders(customerOrders);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  if (!customer) {
    return <p className="text-gray-500">Client introuvable</p>;
  }

  return (
    <div>
      <Link
        href="/clients"
        className="text-sm text-gray-500 hover:text-gray-900 mb-4 inline-block"
      >
        Retour aux clients
      </Link>

      <h1 className="text-2xl font-bold mb-6">
        {customer.firstName} {customer.lastName}
      </h1>

      <div className="bg-white border border-gray-200 rounded p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Email :</span>{" "}
            <span>{customer.email}</span>
          </div>
          <div>
            <span className="text-gray-500">Telephone :</span>{" "}
            <span>{customer.phone}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-gray-500">Adresse :</span>{" "}
            <span>{customer.address}</span>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4">Commandes du client</h2>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucune commande</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Statut</th>
                <th className="text-left px-4 py-3 font-medium">Produits</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: orders filtered, no stable unique key
                <tr key={index} className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    {new Date(order.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.status === "livree"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {formatStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {order.products.length} article(s)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
