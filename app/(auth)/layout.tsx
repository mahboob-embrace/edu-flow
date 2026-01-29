import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme";
import { type Locale } from "@/i18n/config";
import { getLocale } from "@/i18n";
import { LocaleSwitcher } from "@/components/locale-switcher";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = (await getLocale()) as Locale;

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <LocaleSwitcher currentLocale={locale} />
        <ThemeSwitcher />
      </div>
      <div className="w-full max-w-md p-6">{children}</div>
    </div>
  );
}
