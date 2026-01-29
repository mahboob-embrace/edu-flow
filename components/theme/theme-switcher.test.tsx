import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { ThemeSwitcher } from "./theme-switcher";
import { ColorThemeProvider, colorThemes } from "./color-theme-provider";
import { useTheme } from "next-themes";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

// Helper function to render ThemeSwitcher with required providers
function renderThemeSwitcher() {
  return render(
    <ColorThemeProvider>
      <ThemeSwitcher />
    </ColorThemeProvider>,
  );
}

describe("ThemeSwitcher", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");

    // Default mock implementation
    mockUseTheme.mockReturnValue({
      theme: "system",
      setTheme: jest.fn(),
      themes: ["light", "dark", "system"],
      systemTheme: "light",
      resolvedTheme: "light",
      forcedTheme: undefined,
    });
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  describe("Loading State", () => {
    it("loading button has accessible label", () => {
      const useStateSpy = jest.spyOn(React, "useState");
      useStateSpy.mockImplementationOnce(() => [false, jest.fn()]);

      renderThemeSwitcher();

      expect(screen.getByText("Toggle theme")).toBeInTheDocument();

      useStateSpy.mockRestore();
    });
  });

  describe("Mounted State", () => {
    it("renders trigger button when mounted", async () => {
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });
    });

    it("trigger button is not disabled when mounted", async () => {
      renderThemeSwitcher();

      await waitFor(() => {
        expect(screen.getByTestId("theme-switcher-trigger")).not.toBeDisabled();
      });
    });

    it("trigger button has accessible label", async () => {
      renderThemeSwitcher();

      await waitFor(() => {
        expect(screen.getByText("Toggle theme")).toBeInTheDocument();
      });
    });
  });

  describe("Dropdown Menu - Mode Section", () => {
    it("opens dropdown menu when trigger is clicked", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByText("Mode")).toBeInTheDocument();
      });
    });

    it("displays all theme mode options", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("theme-mode-light")).toBeInTheDocument();
        expect(screen.getByTestId("theme-mode-dark")).toBeInTheDocument();
        expect(screen.getByTestId("theme-mode-system")).toBeInTheDocument();
      });
    });

    it("calls setTheme with 'light' when Light option is clicked", async () => {
      const user = userEvent.setup();
      const mockSetTheme = jest.fn();
      mockUseTheme.mockReturnValue({
        theme: "system",
        setTheme: mockSetTheme,
        themes: ["light", "dark", "system"],
        systemTheme: "light",
        resolvedTheme: "light",
        forcedTheme: undefined,
      });

      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("theme-mode-light")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-mode-light"));

      expect(mockSetTheme).toHaveBeenCalledWith("light");
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it("calls setTheme with 'dark' when Dark option is clicked", async () => {
      const user = userEvent.setup();
      const mockSetTheme = jest.fn();
      mockUseTheme.mockReturnValue({
        theme: "system",
        setTheme: mockSetTheme,
        themes: ["light", "dark", "system"],
        systemTheme: "light",
        resolvedTheme: "light",
        forcedTheme: undefined,
      });

      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("theme-mode-dark")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-mode-dark"));

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it("calls setTheme with 'system' when System option is clicked", async () => {
      const user = userEvent.setup();
      const mockSetTheme = jest.fn();
      mockUseTheme.mockReturnValue({
        theme: "light",
        setTheme: mockSetTheme,
        themes: ["light", "dark", "system"],
        systemTheme: "light",
        resolvedTheme: "light",
        forcedTheme: undefined,
      });

      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("theme-mode-system")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-mode-system"));

      expect(mockSetTheme).toHaveBeenCalledWith("system");
      expect(mockSetTheme).toHaveBeenCalledTimes(1);
    });

    it("shows check icon next to active light theme", async () => {
      const user = userEvent.setup();
      mockUseTheme.mockReturnValue({
        theme: "light",
        setTheme: jest.fn(),
        themes: ["light", "dark", "system"],
        systemTheme: "light",
        resolvedTheme: "light",
        forcedTheme: undefined,
      });

      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        const lightOption = screen.getByTestId("theme-mode-light");
        expect(lightOption).toBeInTheDocument();
        // Check icon should be present in the light option
        const checkIcons = lightOption.querySelectorAll("svg");
        expect(checkIcons.length).toBeGreaterThan(1); // Sun icon + Check icon
      });
    });

    it("shows check icon next to active dark theme", async () => {
      const user = userEvent.setup();
      mockUseTheme.mockReturnValue({
        theme: "dark",
        setTheme: jest.fn(),
        themes: ["light", "dark", "system"],
        systemTheme: "dark",
        resolvedTheme: "dark",
        forcedTheme: undefined,
      });

      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        const darkOption = screen.getByTestId("theme-mode-dark");
        expect(darkOption).toBeInTheDocument();
        const checkIcons = darkOption.querySelectorAll("svg");
        expect(checkIcons.length).toBeGreaterThan(1); // Moon icon + Check icon
      });
    });

    it("shows check icon next to active system theme", async () => {
      const user = userEvent.setup();
      mockUseTheme.mockReturnValue({
        theme: "system",
        setTheme: jest.fn(),
        themes: ["light", "dark", "system"],
        systemTheme: "light",
        resolvedTheme: "light",
        forcedTheme: undefined,
      });

      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        const systemOption = screen.getByTestId("theme-mode-system");
        expect(systemOption).toBeInTheDocument();
        const checkIcons = systemOption.querySelectorAll("svg");
        expect(checkIcons.length).toBeGreaterThan(1); // Palette icon + Check icon
      });
    });
  });

  describe("Dropdown Menu - Color Section", () => {
    it("displays Color section label", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByText("Color")).toBeInTheDocument();
      });
    });

    it("displays all color theme options", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        colorThemes.forEach((ct) => {
          expect(
            screen.getByTestId(`theme-color-${ct.value}`),
          ).toBeInTheDocument();
        });
      });
    });

    it("displays color theme names", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        colorThemes.forEach((ct) => {
          expect(screen.getByText(ct.name)).toBeInTheDocument();
        });
      });
    });

    it("switches to amber color theme when clicked", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("theme-color-amber")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-color-amber"));

      await waitFor(() => {
        expect(localStorage.getItem("color-theme")).toBe("amber");
      });
    });

    it("switches to blue color theme when clicked", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("theme-color-blue")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-color-blue"));

      await waitFor(() => {
        expect(localStorage.getItem("color-theme")).toBe("blue");
      });
    });

    it("shows check icon next to active color theme", async () => {
      const user = userEvent.setup();
      localStorage.setItem("color-theme", "emerald");

      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        const emeraldOption = screen.getByTestId("theme-color-emerald");
        expect(emeraldOption).toBeInTheDocument();
        // Check icon should be present
        const checkIcon = emeraldOption.querySelector('svg[class*="ml-auto"]');
        expect(checkIcon).toBeInTheDocument();
      });
    });

    it("displays color preview circles with correct background colors", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        colorThemes.forEach((ct) => {
          const option = screen.getByTestId(`theme-color-${ct.value}`);
          const colorCircle = option.querySelector(
            'span[class*="rounded-full"]',
          );
          expect(colorCircle).toBeInTheDocument();
          expect(colorCircle).toHaveStyle({
            backgroundColor: ct.color,
          });
        });
      });
    });
  });

  describe("Dropdown Menu Behavior", () => {
    it("closes dropdown when clicking outside", async () => {
      const user = userEvent.setup({ pointerEventsCheck: 0 });
      render(
        <div>
          <ColorThemeProvider>
            <ThemeSwitcher />
          </ColorThemeProvider>
          <button data-testid="outside">Outside</button>
        </div>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByText("Mode")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("outside"));

      await waitFor(() => {
        expect(screen.queryByText("Mode")).not.toBeInTheDocument();
      });
    });

    it("closes dropdown when pressing Escape key", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByText("Mode")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("Mode")).not.toBeInTheDocument();
      });
    });

    it("dropdown is closed by default", async () => {
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      expect(screen.queryByText("Mode")).not.toBeInTheDocument();
      expect(screen.queryByText("Color")).not.toBeInTheDocument();
    });
  });

  describe("Integration with ColorThemeProvider", () => {
    it("updates document data-theme attribute when color is changed", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("theme-color-pink")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-color-pink"));

      await waitFor(() => {
        expect(document.documentElement.getAttribute("data-theme")).toBe(
          "pink",
        );
      });
    });

    it("persists color theme selection to localStorage", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-switcher-trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("theme-color-cyan")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("theme-color-cyan"));

      await waitFor(() => {
        expect(localStorage.getItem("color-theme")).toBe("cyan");
      });
    });
  });

  describe("Accessibility", () => {
    it("trigger button is keyboard accessible", async () => {
      renderThemeSwitcher();

      await waitFor(() => {
        const trigger = screen.getByTestId("theme-switcher-trigger");
        expect(trigger).toBeInTheDocument();
        trigger.focus();
        expect(trigger).toHaveFocus();
      });
    });

    it("can open dropdown with Enter key", async () => {
      const user = userEvent.setup();
      renderThemeSwitcher();

      await waitFor(() => {
        expect(
          screen.getByTestId("theme-switcher-trigger"),
        ).toBeInTheDocument();
      });

      const trigger = screen.getByTestId("theme-switcher-trigger");
      trigger.focus();
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByText("Mode")).toBeInTheDocument();
      });
    });

    it("has proper screen reader text", async () => {
      renderThemeSwitcher();

      await waitFor(() => {
        expect(screen.getByText("Toggle theme")).toBeInTheDocument();
      });
    });
  });
});
