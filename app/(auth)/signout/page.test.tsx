import { render, screen } from "@testing-library/react";
import SignOutPage from "./page";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

// Mock the dependencies
jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("SignOutPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects to /sign-in if there is no session", async () => {
    (auth as jest.Mock).mockResolvedValueOnce(null);

    // Server components are just async functions that return JSX
    await SignOutPage();

    expect(redirect).toHaveBeenCalledWith("/sign-in");
  });

  it("renders the sign out page if there is a session", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: { name: "Test User" } });

    const ui = await SignOutPage();
    render(ui);

    expect(screen.getByTestId("signout-card")).toBeInTheDocument();
    expect(screen.getByTestId("signout-title")).toHaveTextContent("Sign Out");
    expect(screen.getByTestId("signout-description")).toHaveTextContent(
      "Are you sure you want to sign out?",
    );
    expect(screen.getByTestId("signout-form")).toBeInTheDocument();
    expect(screen.getByTestId("signout-button")).toBeInTheDocument();
  });

  it("contains a form with a server action", async () => {
    (auth as jest.Mock).mockResolvedValueOnce({ user: { name: "Test User" } });

    const ui = await SignOutPage();
    render(ui);

    const form = screen.getByTestId("signout-form");
    expect(form).toHaveAttribute("action");
    // Note: We can't easily test the server action content here without more complex setup,
    // but we can verify the form and button existence.
  });
});
