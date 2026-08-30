import { confirmationLoadingStyles } from "./confirmation-loading.styles";

export function ConfirmationLoading() {
  return (
    <main className={confirmationLoadingStyles.root}>
      <p className={confirmationLoadingStyles.text}>Loading your receipt…</p>
    </main>
  );
}
