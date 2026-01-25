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
    <Card className="w-full">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Sign Out</CardTitle>
        <CardDescription>Are you sure you want to sign out?</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <Button variant="destructive" className="w-full" type="submit">
            Sign Out
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
