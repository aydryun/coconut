import type { RecordId } from "surrealdb";

export type Product = {
  category: string;
  name: string;
  price: number;
  stock: number;
  id?: RecordId;
};
