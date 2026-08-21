import "server-only";

import braintree from "braintree";

let sandboxGateway: braintree.BraintreeGateway | null = null;

export function getBraintreeSandboxMerchantAccountId() {
  if (process.env.BRAINTREE_ENVIRONMENT !== "Sandbox") {
    throw new Error("Braintree Sandbox is not configured.");
  }

  return process.env.BRAINTREE_MERCHANT_ACCOUNT_ID;
}

export function getBraintreeSandboxGateway() {
  if (sandboxGateway) {
    return sandboxGateway;
  }

  const merchantId = process.env.BRAINTREE_MERCHANT_ID;
  const publicKey = process.env.BRAINTREE_PUBLIC_KEY;
  const privateKey = process.env.BRAINTREE_PRIVATE_KEY;

  if (
    process.env.BRAINTREE_ENVIRONMENT !== "Sandbox" ||
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
