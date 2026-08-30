import { adminPageLoadingStyles } from "./admin-page-loading.styles";
import type { AdminPageLoadingProps } from "./admin-page-loading.types";

export function AdminPageLoading({ message }: AdminPageLoadingProps) {
  return (
    <main className={adminPageLoadingStyles.root}>
      <p className={adminPageLoadingStyles.text}>{message}</p>
    </main>
  );
}
