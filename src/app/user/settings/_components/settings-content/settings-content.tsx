import { redirect } from "next/navigation";
import { SettingsChangePasswordForm } from "@/app/user/settings/_components/settings-change-password-form";
import { SettingsDeleteAccount } from "@/app/user/settings/_components/settings-delete-account";
import { SettingsProfileForm } from "@/app/user/settings/_components/settings-profile-form";
import { getSession } from "@/utils/server";
import { settingsContentStyles } from "./settings-content.styles";

export async function SettingsContent() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  const { user } = session;

  return (
    <main className={settingsContentStyles.root}>
      <header className={settingsContentStyles.header}>
        <h1 className={settingsContentStyles.title} role='heading' aria-level={1}>
          Account settings
        </h1>
        <p className={settingsContentStyles.description}>
          Update your profile, change your password, or delete your account.
        </p>
      </header>
      <SettingsProfileForm
        defaultValues={{
          name: user.name,
          email: user.email,
          image: user.image ?? "",
        }}
      />
      <SettingsChangePasswordForm />
      <SettingsDeleteAccount />
    </main>
  );
}
