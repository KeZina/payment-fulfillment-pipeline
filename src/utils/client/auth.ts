import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { User } from "@/types";

export const auth = createAuthClient({
  user: {
    additionalFields: {
      role: {
        type: "string",
      },
    },
  },
  plugins: [inferAdditionalFields<User>()],
});
