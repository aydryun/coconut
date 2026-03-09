import { Surreal } from "surrealdb";
import type { SurrealResponse } from "@/types/SurrealResponse";

let db: Surreal | null = null;

async function connectToDatabase() {
  if (db) return db;

  try {
    db = new Surreal();

    console.log(process.env);

    await db.connect(process.env.SURREALDB_HOST || "");

    console.log("test");

    await db.signin({
      namespace: process.env.SURREALDB_NAMESPACE || "",
      database: process.env.SURREALDB_AUTH_DATABASE || "",
      username: process.env.SURREALDB_USERNAME || "",
      password: process.env.SURREALDB_PASSWORD || "",
    });

    console.log("Connected to SurrealDB");
    return db;
  } catch (error) {
    console.error("Failed to connect to SurrealDB:", error);
    throw error;
  }
}

async function getUser(email: string) {
  const db = await connectToDatabase();

  try {
    const userInformations: SurrealResponse<any> = await db.query(
      "SELECT * FROM user WHERE email = $email LIMIT 1",
      { email },
    );
    return userInformations[0][0];
  } catch (error) {
    console.error("Failed to get user informations:", error);
    throw new Error("Failed to get user informations");
  }
}

async function validateUserCredentials(email: string, password: string) {
  const db = await connectToDatabase();

  try {
    const userInformations: SurrealResponse<any> = await db.query(
      `SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(password, $password) LIMIT 1`,
      { email, password },
    );
    //db.close();
    return userInformations[0][0];
  } catch (error) {
    console.error("Failed to get user informations:", error);
    throw new Error("Failed to get user informations");
  }
}

export { connectToDatabase, getUser, validateUserCredentials };
