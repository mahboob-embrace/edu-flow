import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ThemeSwitcher } from "@/components/theme-switcher";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <div className="w-full max-w-md p-6">{children}</div>
    </div>
  );
}
