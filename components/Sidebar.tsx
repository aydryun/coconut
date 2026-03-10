"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/clients", label: "Clients" },
  { href: "/products", label: "Produits" },
  { href: "/orders", label: "Commandes" },
];

function Sidebar() {
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();

  return (
    <aside className="w-56 min-h-screen bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-bold">Coconut</h1>
        {user && (
          <p className="text-sm text-gray-400 mt-1">
            {user.name || user.email}
          </p>
        )}
      </div>

      <nav className="flex-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded text-sm mb-1 ${
                isActive
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        {isAdmin && (
          <>
            <div className="border-t border-gray-700 my-2" />
            <Link
              href="/admin/users"
              className={`block px-3 py-2 rounded text-sm ${
                pathname === "/admin/users"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              Utilisateurs (Admin)
            </Link>
          </>
        )}
      </nav>

      <div className="p-2 border-t border-gray-700">
        <button
          type="button"
          onClick={logout}
          className="w-full px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded text-left cursor-pointer"
        >
          Deconnexion
        </button>
      </div>
    </aside>
  );
}

export { Sidebar };
