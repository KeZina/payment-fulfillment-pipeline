import * as v from "valibot";
import { AdminSessionStatus } from "@/constants/admin";
import { UpdateItemSchema } from "@/schemas/admin";
import type { Session } from "./auth";

export type UpdateItemInput = v.InferInput<typeof UpdateItemSchema>;

export type AdminSessionCheck =
  | { status: AdminSessionStatus.Unauthenticated }
  | { status: AdminSessionStatus.Forbidden }
  | { status: AdminSessionStatus.Ok; session: Session };