import {
  auth,
  getConfiguredSandboxGateway,
  clientTokenErrorResponse,
  clientTokenSuccessResponse,
} from "@/lib/server";
import { isSameOriginRequest } from "@/utils/server";

export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return clientTokenErrorResponse("Invalid request origin.", 403);
  }

  const sessionResult = await auth.api
    .getSession({ headers: request.headers })
    .then((session) => ({ session }))
    .catch(() => null);

  if (!sessionResult) {
    return clientTokenErrorResponse(
      "Braintree Sandbox is temporarily unavailable.",
      503,
    );
  }

  if (!sessionResult.session) {
    return clientTokenErrorResponse("Authentication is required.", 401);
  }

  const configuration = getConfiguredSandboxGateway();

  if (!configuration) {
    return clientTokenErrorResponse(
      "Braintree Sandbox is not configured.",
      503,
    );
  }

  try {
    const result = await configuration.gateway.clientToken.generate(
      configuration.merchantAccountId
        ? { merchantAccountId: configuration.merchantAccountId }
        : {},
    );

    if (!result.success || !result.clientToken) {
      return clientTokenErrorResponse(
        "Braintree Sandbox could not create a client token.",
        502,
      );
    }

    return clientTokenSuccessResponse(result.clientToken);
  } catch {
    return clientTokenErrorResponse(
      "Braintree Sandbox could not create a client token.",
      502,
    );
  }
}
