export type ConfirmationContentProps = {
  searchParams: Promise<{
    idempotencyKey?: string;
  }>;
};
