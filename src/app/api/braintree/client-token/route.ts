import {
  auth,
  getBraintreeSandboxGateway,
  getBraintreeSandboxMerchantAccountId,
} from "@/lib/server";
import { isSameOriginRequest } from "@/utils/server";

const NO_STORE_HEADERS = { //TODO move the constant to the constants folder
  "Cache-Control": "private, no-store, max-age=0",
  Vary: "Cookie",
} as const;

function getConfiguredSandboxGateway() {
  try {
    return {
      gateway: getBraintreeSandboxGateway(),
      merchantAccountId: getBraintreeSandboxMerchantAccountId(),
    };
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return Response.json(
      { error: "Invalid request origin." },
      { status: 403, headers: NO_STORE_HEADERS },
    );
  }

  const sessionResult = await auth.api
    .getSession({ headers: request.headers })
    .then((session) => ({ session }))
    .catch(() => null);

  if (!sessionResult) {
    return Response.json(
      { error: "Braintree Sandbox is temporarily unavailable." },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  if (!sessionResult.session) {
    return Response.json(
      { error: "Authentication is required." },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  const configuration = getConfiguredSandboxGateway();

  if (!configuration) {
    return Response.json(
      { error: "Braintree Sandbox is not configured." },
      { status: 503, headers: NO_STORE_HEADERS },
    );
  }

  try {
    const result = await configuration.gateway.clientToken.generate(
      configuration.merchantAccountId
        ? { merchantAccountId: configuration.merchantAccountId }
        : {},
    );

    if (!result.success || !result.clientToken) {
      return Response.json(
        { error: "Braintree Sandbox could not create a client token." },
        { status: 502, headers: NO_STORE_HEADERS },
      );
    }

    return Response.json(
      { clientToken: result.clientToken, sandbox: true },
      { headers: NO_STORE_HEADERS },
    );
  } catch {
    return Response.json(
      { error: "Braintree Sandbox could not create a client token." },
      { status: 502, headers: NO_STORE_HEADERS },
    );
  }
}
