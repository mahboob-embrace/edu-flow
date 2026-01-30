"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
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
import { hardNavigate } from "@/lib/navigation";

export default function SignUpPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError(t("passwordsDoNotMatch"));
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || t("somethingWentWrong"));
        return;
      }

      const signInResponse = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!signInResponse.ok) {
        setError(t("accountCreatedSignInFailed"));
        router.push("/sign-in");
      } else {
        // Use hardNavigate for full page reload to ensure cookies are picked up
        hardNavigate("/dashboard");
      }
    } catch {
      setError(t("somethingWentWrong"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full" data-testid="signup-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">
          {t("createAccountTitle")}
        </CardTitle>
        <CardDescription>{t("signUpDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SocialLoginButtons
          disabled={isLoading}
          callbackUrl="/dashboard"
          testIdPrefix="signup"
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
          data-testid="signup-form"
        >
          {error && (
            <div
              className="p-3 text-sm text-destructive bg-destructive/10 rounded-md"
              data-testid="signup-error"
            >
              {error}
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="name">{t("name")}</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder={t("namePlaceholder")}
              required
              disabled={isLoading}
              data-testid="name-input"
            />
          </div>

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
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              required
              minLength={8}
              disabled={isLoading}
              data-testid="password-input"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={t("passwordPlaceholder")}
              required
              minLength={8}
              disabled={isLoading}
              data-testid="confirm-password-input"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            data-testid="signup-submit"
          >
            {isLoading ? t("signingUp") : t("createAccount")}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground w-full">
          {t("hasAccount")}{" "}
          <Link
            href="/sign-in"
            className="underline underline-offset-4 hover:text-primary"
            data-testid="signin-link"
          >
            {t("signIn")}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
