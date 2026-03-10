"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface DashboardStats {
  customers: number;
  products: number;
  orders: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient<DashboardStats>("/api/protected/dashboard")
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500">Chargement...</p>;
  }

  const cards = [
    { label: "Clients", count: stats?.customers ?? 0, href: "/clients" },
    { label: "Produits", count: stats?.products ?? 0, href: "/products" },
    { label: "Commandes", count: stats?.orders ?? 0, href: "/orders" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-white border border-gray-200 rounded p-6 hover:shadow-md transition-shadow"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold mt-2">{card.count}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
