import { render, screen } from "@testing-library/react";
import AuthErrorPage from "./page";

// Mock next/link as it is used in the component
jest.mock("next/link", () => {
  const MockLink = ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
    [key: string]: unknown;
  }) => {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
  MockLink.displayName = "MockLink";
  return MockLink;
});

describe("AuthErrorPage", () => {
  it("renders the default error message when no error param is provided", () => {
    render(<AuthErrorPage searchParams={{}} />);

    expect(screen.getByTestId("auth-error-title")).toHaveTextContent(
      "Authentication Error",
    );
    expect(screen.getByTestId("auth-error-description")).toHaveTextContent(
      "An error occurred during authentication.",
    );
    expect(screen.getByTestId("auth-error-button")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /try again/i })).toHaveAttribute(
      "href",
      "/sign-in",
    );
  });

  it("renders the configuration error message", () => {
    render(<AuthErrorPage searchParams={{ error: "Configuration" }} />);
    expect(screen.getByTestId("auth-error-description")).toHaveTextContent(
      "There is a problem with the server configuration.",
    );
  });

  it("renders the AccessDenied error message", () => {
    render(<AuthErrorPage searchParams={{ error: "AccessDenied" }} />);
    expect(screen.getByTestId("auth-error-description")).toHaveTextContent(
      "Access denied. You do not have permission to sign in.",
    );
  });

  it("renders the Verification error message", () => {
    render(<AuthErrorPage searchParams={{ error: "Verification" }} />);
    expect(screen.getByTestId("auth-error-description")).toHaveTextContent(
      "The verification link has expired or has already been used.",
    );
  });

  it("renders the default message for an unknown error code", () => {
    render(<AuthErrorPage searchParams={{ error: "UnknownError" }} />);
    expect(screen.getByTestId("auth-error-description")).toHaveTextContent(
      "An error occurred during authentication.",
    );
  });
});
