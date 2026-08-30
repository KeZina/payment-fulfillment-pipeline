import { SignInForm } from "../sign-in-form";
import type { SignInFormResolvedProps } from "./sign-in-form-resolved.types";

export async function SignInFormResolved({
  searchParams,
}: SignInFormResolvedProps) {
  const { callbackUrl } = await searchParams;

  return <SignInForm callbackUrl={callbackUrl} />;
}
