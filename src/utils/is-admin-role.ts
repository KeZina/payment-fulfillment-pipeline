import { UserRole } from "@/constants";

export function isAdminRole(role: string | undefined | null) {
  return role === UserRole.Admin;
}
