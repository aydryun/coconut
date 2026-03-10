import type { Surreal } from "surrealdb";
import { StringRecordId } from "surrealdb";
import type { Customer } from "@/types/Customer";
import type { Order } from "@/types/Order";
import type { Product } from "@/types/Product";

import { SurrealConnection } from "./surreal-connection";

// ============================================
// Helper
// ============================================

async function withDatabase<T>(fn: (db: Surreal) => Promise<T>): Promise<T> {
  const connection = new SurrealConnection();
  const database = await connection.getSurrealInstance();
  try {
    return await fn(database);
  } finally {
    database.close();
  }
}

// ============================================
// Customers
// ============================================

async function getCustomers() {
  return withDatabase(async (db) => {
    const result = await db.query("SELECT * FROM customer;");
    return result[0];
  });
}

async function getCustomer(id: string) {
  return withDatabase(async (db) => {
    const result = await db.query(
      "SELECT * FROM customer WHERE id = $id LIMIT 1;",
      { id: `customer:${id}` },
    );
    return (result[0] as any[])[0] || null;
  });
}

async function createCustomer(customer: Omit<Customer, "id">) {
  return withDatabase(async (db) => {
    const result = await db.query("CREATE ONLY customer CONTENT $content;", {
      content: customer,
    });
    return result[0];
  });
}

async function updateCustomer(id: string, customer: Partial<Customer>) {
  return withDatabase(async (db) => {
    const setClauses: string[] = [];
    const vars: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(customer)) {
      if (key === "id") continue;
      setClauses.push(`${key} = $${key}`);
      vars[key] = value;
    }
    const result = await db.query(
      `UPDATE customer:${id} SET ${setClauses.join(", ")} RETURN AFTER;`,
      vars,
    );
    return (result[0] as any[])[0] || null;
  });
}

async function deleteCustomer(id: string) {
  return withDatabase(async (db) => {
    const result: any = await db.query("DELETE ONLY $id RETURN BEFORE;", {
      id: new StringRecordId(`customer:${id}`),
    });
    return result[0];
  });
}

// ============================================
// Products
// ============================================

async function getProducts() {
  return withDatabase(async (db) => {
    const result = await db.query("SELECT * FROM product;");
    return result[0];
  });
}

async function getProduct(id: string) {
  return withDatabase(async (db) => {
    const result = await db.query(
      "SELECT * FROM product WHERE id = $id LIMIT 1;",
      { id: `product:${id}` },
    );
    return (result[0] as any[])[0] || null;
  });
}

async function createProduct(newProduct: Omit<Product, "id">) {
  return withDatabase(async (db) => {
    const result = await db.query("CREATE ONLY product CONTENT $content;", {
      content: newProduct,
    });
    return result[0];
  });
}

async function updateProduct(id: string, product: Partial<Product>) {
  return withDatabase(async (db) => {
    const setClauses: string[] = [];
    const vars: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(product)) {
      if (key === "id") continue;
      setClauses.push(`${key} = $${key}`);
      vars[key] = value;
    }
    const result = await db.query(
      `UPDATE product:${id} SET ${setClauses.join(", ")} RETURN AFTER;`,
      vars,
    );
    return (result[0] as any[])[0] || null;
  });
}

async function deleteProduct(id: string) {
  return withDatabase(async (db) => {
    const result: any = await db.query("DELETE ONLY $id RETURN BEFORE;", {
      id: new StringRecordId(`product:${id}`),
    });
    return result[0];
  });
}

// ============================================
// Orders
// ============================================

async function getOrders() {
  return withDatabase(async (db) => {
    const result = await db.query(
      "SELECT *, customer.firstName, customer.lastName FROM order FETCH products.product;",
    );
    return result[0];
  });
}

async function getOrder(id: string) {
  return withDatabase(async (db) => {
    const result = await db.query(
      "SELECT *, customer.firstName, customer.lastName FROM order WHERE id = $id LIMIT 1 FETCH products.product;",
      { id: `order:${id}` },
    );
    return (result[0] as any[])[0] || null;
  });
}

async function getOrdersByCustomer(customerId: string) {
  return withDatabase(async (db) => {
    const result = await db.query(
      "SELECT * FROM order WHERE customer = $customerId;",
      { customerId: `customer:${customerId}` },
    );
    return result[0];
  });
}

async function createOrder(order: Omit<Order, "id" | "date">) {
  return withDatabase(async (db) => {
    const content = {
      customer: new StringRecordId(String(order.customer)),
      products: order.products.map((item) => ({
        product: new StringRecordId(String(item.product)),
        quantity: item.quantity,
      })),
      status: order.status,
    };
    const result = await db.query("CREATE ONLY order CONTENT $content;", {
      content,
    });
    return result[0];
  });
}

async function updateOrder(id: string, order: Partial<Order>) {
  return withDatabase(async (db) => {
    const result = await db.query(
      `UPDATE order:${id} SET status = $status RETURN AFTER;`,
      { status: order.status },
    );
    return (result[0] as any[])[0] || null;
  });
}

async function deleteOrder(id: string) {
  return withDatabase(async (db) => {
    const result: any = await db.query("DELETE ONLY $id RETURN BEFORE;", {
      id: new StringRecordId(`order:${id}`),
    });
    return result[0];
  });
}

// ============================================
// Dashboard Stats
// ============================================

async function getDashboardStats() {
  return withDatabase(async (db) => {
    const result = await db.query(`
      RETURN {
        customers: (SELECT count() FROM customer GROUP ALL)[0].count,
        products: (SELECT count() FROM product GROUP ALL)[0].count,
        orders: (SELECT count() FROM order GROUP ALL)[0].count
      };
    `);
    const raw = result[0] as any;
    return {
      customers: raw?.customers ?? 0,
      products: raw?.products ?? 0,
      orders: raw?.orders ?? 0,
    };
  });
}

export {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getOrders,
  getOrder,
  getOrdersByCustomer,
  createOrder,
  updateOrder,
  deleteOrder,
  getDashboardStats,
};
