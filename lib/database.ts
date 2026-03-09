import type { Surreal } from "surrealdb";
import type { Product } from "@/types/Product";

import { SurrealConnection } from "./surreal-connection";

async function getInfo() {
  const connection: SurrealConnection = new SurrealConnection();

  const database: Surreal = await connection.getSurrealInstance();

  try {
    const result = await database.query("SELECT * FROM customer;");
    console.log("INFO result:", result);

    database.close();
    return result;
  } catch (err) {
    console.error("getInfo error:", err);
    throw err;
  }
}

async function createProduct(newProduct: Product) {
  const connection: SurrealConnection = new SurrealConnection();

  const database: Surreal = await connection.getSurrealInstance();

  try {
    const result = await database.query(
      `CREATE ONLY product content $content;`,
      {
        content: newProduct,
      },
    );

    database.close();
    return result;
  } catch (err) {
    console.error("createProduct error:", err);
    throw err;
  }
}

export { getInfo, createProduct };
