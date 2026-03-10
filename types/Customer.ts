import type { RecordId } from "surrealdb";

export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  id?: RecordId;
};
