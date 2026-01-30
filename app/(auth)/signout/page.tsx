import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default async function SignOutPage() {
  const session = await auth();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <Card className="w-full" data-testid="signout-card">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold" data-testid="signout-title">
          Sign Out
        </CardTitle>
        <CardDescription data-testid="signout-description">
          Are you sure you want to sign out?
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form
          data-testid="signout-form"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button
            variant="destructive"
            className="w-full"
            type="submit"
            data-testid="signout-button"
          >
            Sign Out
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
