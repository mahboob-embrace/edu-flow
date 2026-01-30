"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { hardNavigate } from "@/lib/navigation";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";
import { SocialLoginButtons } from "@/components/auth";

export default function SignInPage() {
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("invalidCredentials"));
        return;
      }
      // Use hardNavigate for full page reload to ensure cookies are picked up
      hardNavigate("/dashboard");
    } catch {
      setError(t("somethingWentWrong"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full" data-testid="signin-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{t("welcomeBack")}</CardTitle>
        <CardDescription>{t("signInDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SocialLoginButtons
          disabled={isLoading}
          callbackUrl="/dashboard"
          testIdPrefix="signin"
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {t("orContinueWith")}
            </span>
          </div>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid gap-4"
          data-testid="signin-form"
        >
          {error && (
            <div
              className="p-3 text-sm text-destructive bg-destructive/10 rounded-md"
              data-testid="signin-error"
            >
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              required
              disabled={isLoading}
              data-testid="email-input"
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("password")}</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              required
              disabled={isLoading}
              data-testid="password-input"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            data-testid="signin-submit"
          >
            {isLoading ? t("signingIn") : t("signIn")}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground w-full">
          {t("noAccount")}{" "}
          <Link
            href="/sign-up"
            className="underline underline-offset-4 hover:text-primary"
          >
            {t("signUp")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
