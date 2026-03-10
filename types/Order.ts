import type { RecordId } from "surrealdb";

export type OrderProduct = {
  product: RecordId;
  quantity: number;
};

export type Order = {
  customer: RecordId;
  products: OrderProduct[];
  status: "en cours" | "livree";
  date: string;
  id?: RecordId;
};
