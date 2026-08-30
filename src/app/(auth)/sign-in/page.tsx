import { SignInForm } from "../_components/sign-in-form";

type SignInPageProps = {
  searchParams: Promise<{
    callbackUrl?: string;
  }>;
};

export default async function Page({ searchParams }: SignInPageProps) {
  const { callbackUrl } = await searchParams;

  return <SignInForm callbackUrl={callbackUrl} />;
}
