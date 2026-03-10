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

function getId(record: any): string {
  if (typeof record.id === "string") {
    return record.id.includes(":") ? record.id.split(":")[1] : record.id;
  }
  return record.id?.id ?? "";
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
  });

  function loadProducts() {
    setLoading(true);
    apiClient<Product[]>("/api/protected/products")
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: load on mount only
  useEffect(() => {
    loadProducts();
  }, []);

  function resetForm() {
    setForm({ name: "", price: "", category: "", stock: "" });
    setShowForm(false);
    setEditingId(null);
  }

  function handleEdit(product: Product) {
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      stock: String(product.stock),
    });
    setEditingId(getId(product));
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name: form.name,
      price: Number.parseFloat(form.price),
      category: form.category,
      stock: Number.parseInt(form.stock, 10),
    };

    try {
      if (editingId) {
        await apiClient(`/api/protected/products/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiClient("/api/protected/products", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      resetForm();
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm("Supprimer ce produit ?")) return;
    try {
      await apiClient(`/api/protected/products/${getId(product)}`, {
        method: "DELETE",
      });
      loadProducts();
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
        <h1 className="text-2xl font-bold">Produits</h1>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-gray-900 text-white px-4 py-2 rounded text-sm hover:bg-gray-800 cursor-pointer"
        >
          Ajouter un produit
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
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Prix"
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Categorie"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <input
              placeholder="Stock"
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
              className="border border-gray-300 rounded px-3 py-2 text-sm"
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
              <th className="text-left px-4 py-3 font-medium">Categorie</th>
              <th className="text-left px-4 py-3 font-medium">Prix</th>
              <th className="text-left px-4 py-3 font-medium">Stock</th>
              <th className="text-left px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={getId(product)} className="border-b border-gray-100">
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{product.price.toFixed(2)} EUR</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleEdit(product)}
                    className="text-gray-600 hover:text-gray-900 mr-3 cursor-pointer"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                  Aucun produit
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
