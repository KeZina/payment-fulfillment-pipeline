import { betterAuth } from "better-auth/minimal";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { UserRole } from "@/constants";

// Roles are server-controlled via the admin plugin (`input: false` on `role`).
// Sign-up always receives `defaultRole`. Promoting users to admin requires an
// existing admin session (`POST /api/auth/admin/set-role`). The first admin
// must be seeded directly in PostgreSQL — the app cannot bootstrap one.
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: false,
    },
    deleteUser: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      defaultRole: UserRole.User,
      adminRoles: [UserRole.Admin],
    }),
    nextCookies(),
  ],
});
