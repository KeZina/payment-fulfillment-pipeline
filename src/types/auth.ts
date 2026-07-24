import { SignInSchema, SignUpSchema } from "@/schemas";
import { auth } from "@/utils/server";
import * as v from "valibot";

export type SignInCreds = v.InferInput<typeof SignInSchema>;
export type SignUpCreds = v.InferInput<typeof SignUpSchema>;
export type Session = typeof auth.$Infer.Session;
export type User = Session["user"];
