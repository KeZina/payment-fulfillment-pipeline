import { Suspense } from "react";
import { SignInForm } from "../_components/sign-in-form";
import { SignInFormResolved } from "../_components/sign-in-form-resolved";

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default function Page({ searchParams }: SignInPageProps) {
  return (
    <Suspense fallback={<SignInForm />}>
      <SignInFormResolved searchParams={searchParams} />
    </Suspense>
  );
}
