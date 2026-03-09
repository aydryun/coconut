import type { StringRecordId, Surreal } from "surrealdb";
import type { SurrealResponse } from "@/types/SurrealResponse";
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

async function createPost(newPost: number) {
  const connection: SurrealConnection = new SurrealConnection();

  const database: Surreal = await connection.getSurrealInstance();

  try {
    const result = await database.query(`CREATE ONLY post content $content;`, {
      content: newPost,
    });

    database.close();
    return result;
  } catch (err) {
    console.error("createProduct error:", err);
    throw err;
  }
}

export { getInfo, createPost };
