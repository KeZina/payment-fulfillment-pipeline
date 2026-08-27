import { historyLoadingStyles } from "./history-loading.styles";

export function HistoryLoading() {
  return (
    <main className={historyLoadingStyles.root}>
      <p className={historyLoadingStyles.text}>Loading order history…</p>
    </main>
  );
}
