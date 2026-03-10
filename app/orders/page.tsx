"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";

interface Product {
  id: any;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface Customer {
  id: any;
  firstName: string;
  lastName: string;
}

interface OrderItem {
  product: any;
  quantity: number;
}

interface Order {
  id: any;
  customer: any;
  products: OrderItem[];
  status: string;
  date: string;
}

function getId(record: any): string {
  if (typeof record === "string") {
    return record.includes(":") ? record.split(":")[1] : record;
  }
  if (record?.id) {
    if (typeof record.id === "string") {
      return record.id.includes(":") ? record.id.split(":")[1] : record.id;
    }
    return record.id?.id ?? "";
  }
  return "";
}

function getCustomerName(customer: any): string {
  if (customer?.firstName) {
    return `${customer.firstName} ${customer.lastName || ""}`.trim();
  }
  if (typeof customer === "string") {
    return customer;
  }
  return "-";
}

function getProductName(product: any): string {
  if (typeof product === "object" && product?.name) {
    return product.name;
  }
  if (typeof product === "string") {
    return product;
  }
  return "-";
}

function buildProductsTooltip(items: OrderItem[]): string {
  return items
    .map((item) => `${getProductName(item.product)} x${item.quantity}`)
    .join("\n");
}

function getRecordString(table: string, id: string): string {
  return `${table}:${id}`;
}

function formatStatus(status: string): string {
  if (status === "livree") return "Livrée";
  if (status === "en cours") return "En cours";
  return status;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [orderItems, setOrderItems] = useState<
    { productId: string; quantity: number }[]
  >([{ productId: "", quantity: 1 }]);

  function loadData() {
    setLoading(true);
    Promise.all([
      apiClient<Order[]>("/api/protected/orders"),
      apiClient<Customer[]>("/api/protected/customers"),
      apiClient<Product[]>("/api/protected/products"),
    ])
      .then(([ord, cust, prod]) => {
        setOrders(ord);
        setCustomers(cust);
        setProducts(prod);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: load on mount only
  useEffect(() => {
    loadData();
  }, []);

  function resetForm() {
    setShowForm(false);
    setSelectedCustomer("");
    setOrderItems([{ productId: "", quantity: 1 }]);
  }

  function addItem() {
    setOrderItems([...orderItems, { productId: "", quantity: 1 }]);
  }

  function removeItem(index: number) {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: string, value: string | number) {
    const updated = [...orderItems];
    updated[index] = { ...updated[index], [field]: value };
    setOrderItems(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      customer: getRecordString("customer", selectedCustomer),
      products: orderItems
        .filter((item) => item.productId)
        .map((item) => ({
          product: getRecordString("product", item.productId),
          quantity: item.quantity,
        })),
      status: "en cours",
    };

    try {
      await apiClient("/api/protected/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      resetForm();
      loadData();
    } catch (err) {
      console.error(err);
    }
  }

  async function toggleStatus(order: Order) {
    const newStatus = order.status === "en cours" ? "livree" : "en cours";
    try {
      await apiClient(`/api/protected/orders/${getId(order)}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(order: Order) {
    if (!confirm("Supprimer cette commande ?")) return;
    try {
      await apiClient(`/api/protected/orders/${getId(order)}`, {
        method: "DELETE",
      });
      loadData();
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
        <h1 className="text-2xl font-bold">Commandes</h1>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 cursor-pointer"
        >
          Nouvelle commande
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded p-4 mb-6"
        >
          <div className="mb-4">
            <label
              htmlFor="customer-select"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Client
            </label>
            <select
              id="customer-select"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full"
            >
              <option value="">Selectionner un client</option>
              {customers.map((c) => (
                <option key={getId(c)} value={getId(c)}>
                  {c.firstName} {c.lastName}
                </option>
              ))}
            </select>
          </div>

          <p className="block text-sm font-medium text-gray-700 mb-2">
            Produits
          </p>
          {orderItems.map((item, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: order items have no stable id
            <div key={index} className="flex gap-2 mb-2">
              <select
                value={item.productId}
                onChange={(e) => updateItem(index, "productId", e.target.value)}
                required
                className="border border-gray-300 rounded px-3 py-2 text-sm flex-1"
              >
                <option value="">Selectionner un produit</option>
                {products.map((p) => (
                  <option key={getId(p)} value={getId(p)}>
                    {p.name} ({p.price.toFixed(2)} EUR)
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateItem(
                    index,
                    "quantity",
                    Number.parseInt(e.target.value, 10),
                  )
                }
                className="border border-gray-300 rounded px-3 py-2 text-sm w-20"
              />
              {orderItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-800 text-sm cursor-pointer"
                >
                  Retirer
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addItem}
            className="text-sm text-gray-600 hover:text-gray-900 mb-4 cursor-pointer"
          >
            + Ajouter un produit
          </button>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 cursor-pointer"
            >
              Creer la commande
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
              <th className="text-left px-4 py-3 font-medium">Date</th>
              <th className="text-left px-4 py-3 font-medium">Client</th>
              <th className="text-left px-4 py-3 font-medium">Produits</th>
              <th className="text-left px-4 py-3 font-medium">Statut</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={getId(order)} className="border-b border-gray-100">
                <td className="px-4 py-3">
                  {new Date(order.date).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">{getCustomerName(order.customer)}</td>
                <td className="px-4 py-3">
                  <span
                    className="underline decoration-dotted cursor-default"
                    title={buildProductsTooltip(order.products)}
                  >
                    {order.products.length} article(s)
                  </span>
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
                  <button
                    type="button"
                    onClick={() => toggleStatus(order)}
                    className="text-gray-600 hover:text-gray-900 mr-3 cursor-pointer"
                  >
                    {order.status === "en cours"
                      ? "Marquer livrée"
                      : "Marquer en cours"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(order)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Aucune commande
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
