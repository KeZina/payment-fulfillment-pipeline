import "server-only";

import { notFound, redirect } from "next/navigation";
import { AdminSessionStatus } from "@/constants/admin";
import type { AdminSessionCheck } from "@/types/admin";
import { isAdminRole } from "@/utils/is-admin-role";
import { getSession } from "./get-session";

async function checkAdminSession(): Promise<AdminSessionCheck> {
  const session = await getSession();

  if (!session) {
    return { status: AdminSessionStatus.Unauthenticated };
  }

  if (!isAdminRole(session.user.role)) {
    return { status: AdminSessionStatus.Forbidden };
  }

  return { status: AdminSessionStatus.Ok, session };
}

export async function getAdminPageSession() {
  const result = await checkAdminSession();

  if (result.status === AdminSessionStatus.Unauthenticated) {
    redirect("/sign-in");
  }

  if (result.status === AdminSessionStatus.Forbidden) {
    notFound();
  }

  return result.session;
}

export async function assertAdminSession() {
  const result = await checkAdminSession();

  if (result.status === AdminSessionStatus.Unauthenticated) {
    throw new Error("You must be signed in");
  }

  if (result.status === AdminSessionStatus.Forbidden) {
    throw new Error("You do not have permission to perform this action");
  }

  return result.session;
}
