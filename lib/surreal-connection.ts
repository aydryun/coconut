import { Surreal } from "surrealdb";

import type ConnectionSettings from "@/types/ConnectionSettings";

export class SurrealConnection {
  connectionSettings: ConnectionSettings;

  constructor() {
    this.connectionSettings = {
      host: process.env.SURREALDB_HOST || "",
      namespace: process.env.SURREALDB_NAMESPACE || "",
      database: process.env.SURREALDB_DATABASE || "",
      username: process.env.SURREALDB_USERNAME || "",
      password: process.env.SURREALDB_PASSWORD || "",
    };
  }

  public async getSurrealInstance(): Promise<Surreal> {
    const settings: ConnectionSettings = this.connectionSettings;
    const db = new Surreal();

    await db.connect(settings.host);

    await db.signin({
      namespace: settings.namespace,
      database: settings.database,
      username: settings.username,
      password: settings.password,
    });

    return db;
  }
}
