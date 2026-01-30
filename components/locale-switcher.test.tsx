import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LocaleSwitcher } from "./locale-switcher";
import { locales } from "@/i18n/config";
import { setLocale } from "@/i18n/actions";
import { useRouter } from "next/navigation";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock i18n actions
jest.mock("../i18n/actions", () => ({
  setLocale: jest.fn().mockResolvedValue(undefined),
  getLocale: jest.fn().mockResolvedValue("en"),
}));

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockSetLocale = setLocale as jest.MockedFunction<typeof setLocale>;

describe("LocaleSwitcher", () => {
  let mockRouter: { refresh: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    mockRouter = {
      refresh: jest.fn(),
    };

    mockUseRouter.mockReturnValue(
      mockRouter as unknown as ReturnType<typeof useRouter>,
    );
    mockSetLocale.mockResolvedValue();
  });

  describe("Rendering", () => {
    it("renders the trigger button", () => {
      render(<LocaleSwitcher currentLocale="en" />);

      expect(screen.getByTestId("locale-switcher-trigger")).toBeInTheDocument();
    });

    it("trigger button is not disabled by default", () => {
      render(<LocaleSwitcher currentLocale="en" />);

      expect(screen.getByTestId("locale-switcher-trigger")).not.toBeDisabled();
    });

    it("has accessible label for screen readers", () => {
      render(<LocaleSwitcher currentLocale="en" />);

      expect(screen.getByText("Switch language")).toBeInTheDocument();
    });

    it("displays Globe icon", () => {
      render(<LocaleSwitcher currentLocale="en" />);

      const button = screen.getByTestId("locale-switcher-trigger");
      const icon = button.querySelector("svg");
      expect(icon).toBeInTheDocument();
    });
  });

  describe("Dropdown Menu", () => {
    it("opens dropdown menu when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByText("English")).toBeInTheDocument();
      });
    });

    it("displays all available locales", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        locales.forEach((locale) => {
          expect(
            screen.getByTestId(`locale-option-${locale}`),
          ).toBeInTheDocument();
        });
      });
    });

    it("displays correct locale names", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByText("English")).toBeInTheDocument();
        expect(screen.getByText("Dansk")).toBeInTheDocument();
        expect(screen.getByText("العربية")).toBeInTheDocument();
      });
    });

    it("closes dropdown when clicking outside", async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 });
      render(
        <div>
          <LocaleSwitcher currentLocale="en" />
          <button data-testid="outside">Outside</button>
        </div>,
      );

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByText("English")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("outside"));

      await waitFor(() => {
        expect(screen.queryByText("English")).not.toBeInTheDocument();
      });
    });

    it("closes dropdown when pressing Escape key", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByText("English")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("English")).not.toBeInTheDocument();
      });
    });

    it("dropdown is closed by default", () => {
      render(<LocaleSwitcher currentLocale="en" />);

      expect(screen.queryByText("English")).not.toBeInTheDocument();
      expect(screen.queryByText("Dansk")).not.toBeInTheDocument();
    });
  });

  describe("Locale Switching", () => {
    it("calls setLocale when English is selected", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="da" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("locale-option-en")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("locale-option-en"));

      await waitFor(() => {
        expect(mockSetLocale).toHaveBeenCalledWith("en");
      });
    });

    it("calls setLocale when Danish is selected", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("locale-option-da")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("locale-option-da"));

      await waitFor(() => {
        expect(mockSetLocale).toHaveBeenCalledWith("da");
      });
    });

    it("calls setLocale when Arabic is selected", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("locale-option-ar")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("locale-option-ar"));

      await waitFor(() => {
        expect(mockSetLocale).toHaveBeenCalledWith("ar");
      });
    });

    it("calls router.refresh after locale change", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("locale-option-da")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("locale-option-da"));

      await waitFor(() => {
        expect(mockRouter.refresh).toHaveBeenCalled();
      });
    });

    it("calls setLocale only once per selection", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("locale-option-da")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("locale-option-da"));

      await waitFor(() => {
        expect(mockSetLocale).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("Current Locale Highlighting", () => {
    it("highlights English when it is the current locale", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        const englishOption = screen.getByTestId("locale-option-en");
        expect(englishOption).toHaveClass("bg-accent");
      });
    });

    it("highlights Danish when it is the current locale", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="da" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        const danishOption = screen.getByTestId("locale-option-da");
        expect(danishOption).toHaveClass("bg-accent");
      });
    });

    it("highlights Arabic when it is the current locale", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="ar" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        const arabicOption = screen.getByTestId("locale-option-ar");
        expect(arabicOption).toHaveClass("bg-accent");
      });
    });

    it("does not highlight non-current locales", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        const danishOption = screen.getByTestId("locale-option-da");
        const arabicOption = screen.getByTestId("locale-option-ar");
        expect(danishOption).not.toHaveClass("bg-accent");
        expect(arabicOption).not.toHaveClass("bg-accent");
      });
    });

    it("only one locale is highlighted at a time", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="da" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        const highlightedOptions = screen
          .getAllByRole("menuitem")
          .filter((item) => item.classList.contains("bg-accent"));
        expect(highlightedOptions).toHaveLength(1);
      });
    });
  });

  describe("Pending State", () => {
    it("disables trigger button during transition", async () => {
      const user = userEvent.setup();

      // Mock setLocale to delay resolution
      mockSetLocale.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(<LocaleSwitcher currentLocale="en" />);

      const trigger = screen.getByTestId("locale-switcher-trigger");
      expect(trigger).not.toBeDisabled();

      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByTestId("locale-option-da")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("locale-option-da"));

      // Button should be disabled during transition
      await waitFor(() => {
        expect(trigger).toBeDisabled();
      });
    });
  });

  describe("Accessibility", () => {
    it("trigger button is keyboard accessible", () => {
      render(<LocaleSwitcher currentLocale="en" />);

      const trigger = screen.getByTestId("locale-switcher-trigger");
      trigger.focus();
      expect(trigger).toHaveFocus();
    });

    it("can open dropdown with Enter key", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      const trigger = screen.getByTestId("locale-switcher-trigger");
      trigger.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("English")).toBeInTheDocument();
      });
    });

    it("has proper screen reader text", () => {
      render(<LocaleSwitcher currentLocale="en" />);

      expect(screen.getByText("Switch language")).toBeInTheDocument();
    });

    it("all locale options are accessible via role", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        const menuItems = screen.getAllByRole("menuitem");
        expect(menuItems).toHaveLength(locales.length);
      });
    });
  });

  describe("Edge Cases", () => {
    it("handles clicking the same locale that is already active", async () => {
      const user = userEvent.setup();
      render(<LocaleSwitcher currentLocale="en" />);

      await user.click(screen.getByTestId("locale-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("locale-option-en")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("locale-option-en"));

      await waitFor(() => {
        expect(mockSetLocale).toHaveBeenCalledWith("en");
      });
    });

    it("prevents interaction while locale change is in progress", async () => {
      const user = userEvent.setup();

      // Mock setLocale to delay resolution so we can test the pending state
      mockSetLocale.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      render(<LocaleSwitcher currentLocale="en" />);

      const trigger = screen.getByTestId("locale-switcher-trigger");
      expect(trigger).not.toBeDisabled();

      // Open dropdown and select a locale
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByTestId("locale-option-da")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("locale-option-da"));

      // Dropdown should close after selection
      await waitFor(() => {
        expect(
          screen.queryByTestId("locale-option-da"),
        ).not.toBeInTheDocument();
      });

      // Button should be disabled during transition
      await waitFor(() => {
        expect(trigger).toBeDisabled();
      });

      // Verify setLocale was called
      expect(mockSetLocale).toHaveBeenCalledWith("da");
      expect(mockSetLocale).toHaveBeenCalledTimes(1);

      // Verify that clicking the disabled button does nothing
      // (userEvent will still fire the click event, but the button should ignore it)
      const clicksBefore = mockSetLocale.mock.calls.length;
      await user.click(trigger);

      // No additional calls should have been made
      expect(mockSetLocale).toHaveBeenCalledTimes(clicksBefore);
    });
  });

  describe("Props Validation", () => {
    it("accepts 'en' as currentLocale", () => {
      render(<LocaleSwitcher currentLocale="en" />);
      expect(screen.getByTestId("locale-switcher-trigger")).toBeInTheDocument();
    });

    it("accepts 'da' as currentLocale", () => {
      render(<LocaleSwitcher currentLocale="da" />);
      expect(screen.getByTestId("locale-switcher-trigger")).toBeInTheDocument();
    });

    it("accepts 'ar' as currentLocale", () => {
      render(<LocaleSwitcher currentLocale="ar" />);
      expect(screen.getByTestId("locale-switcher-trigger")).toBeInTheDocument();
    });
  });
});
