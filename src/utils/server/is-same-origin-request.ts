export function isSameOriginRequest(request: Request) {
  const origin = request.headers.get("origin");
  const canonicalUrl = process.env.BETTER_AUTH_URL;

  if (!origin || !canonicalUrl) {
    return false;
  }

  try {
    return new URL(origin).origin === new URL(canonicalUrl).origin;
  } catch {
    return false;
  }
}
