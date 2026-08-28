import { settingsLoadingStyles } from "./settings-loading.styles";

export function SettingsLoading() {
  return (
    <main className={settingsLoadingStyles.root}>
      <p className={settingsLoadingStyles.text}>Loading account settings…</p>
    </main>
  );
}
