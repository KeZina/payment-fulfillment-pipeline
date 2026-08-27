import "server-only";

import braintree from "braintree";
import { SANDBOX_ENVIRONMENT } from "@/constants";

let sandboxGateway: braintree.BraintreeGateway | null = null;

export function getSandboxMerchantAccountId() {
  if (process.env.BRAINTREE_ENVIRONMENT !== SANDBOX_ENVIRONMENT) {
    throw new Error("Braintree Sandbox is not configured.");
  }

  return process.env.BRAINTREE_MERCHANT_ACCOUNT_ID;
}

export function getSandboxGateway() {
  if (sandboxGateway) {
    return sandboxGateway;
  }

  const merchantId = process.env.BRAINTREE_MERCHANT_ID;
  const publicKey = process.env.BRAINTREE_PUBLIC_KEY;
  const privateKey = process.env.BRAINTREE_PRIVATE_KEY;

  if (
    process.env.BRAINTREE_ENVIRONMENT !== SANDBOX_ENVIRONMENT ||
    !merchantId ||
    !publicKey ||
    !privateKey
  ) {
    throw new Error("Braintree Sandbox is not configured.");
  }

  sandboxGateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId,
    publicKey,
    privateKey,
  });

  return sandboxGateway;
}

export function getConfiguredSandboxGateway() {
  try {
    return {
      gateway: getSandboxGateway(),
      merchantAccountId: getSandboxMerchantAccountId(),
    };
  } catch {
    return null;
  }
}
