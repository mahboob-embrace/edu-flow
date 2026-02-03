import { fn } from "storybook/test";

export const signIn = fn(async () => {
  console.log("[Storybook Mock] signIn called");
  return { error: null, ok: true, status: 200, url: null };
}).mockName("signIn");

export const signOut = fn(async () => {
  console.log("[Storybook Mock] signOut called");
}).mockName("signOut");

export const useSession = fn(() => ({
  data: null,
  status: "unauthenticated",
})).mockName("useSession");

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return children;
};
