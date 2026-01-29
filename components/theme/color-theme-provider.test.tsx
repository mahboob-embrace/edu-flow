import { render, screen, waitFor, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import * as React from "react";
import {
  ColorThemeProvider,
  useColorTheme,
  colorThemes,
} from "./color-theme-provider";

// Helper component to test the hook
function TestComponent({ onRender }: { onRender?: () => void }) {
  const { colorTheme, setColorTheme } = useColorTheme();

  React.useEffect(() => {
    onRender?.();
  }, [onRender]);

  return (
    <div>
      <div data-testid="current-theme">{colorTheme}</div>
      <button data-testid="set-amber" onClick={() => setColorTheme("amber")}>
        Set Amber
      </button>
      <button data-testid="set-blue" onClick={() => setColorTheme("blue")}>
        Set Blue
      </button>
      <button
        data-testid="set-default"
        onClick={() => setColorTheme("default")}
      >
        Set Default
      </button>
    </div>
  );
}

describe("ColorThemeProvider", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear any data-theme attribute
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  describe("Provider Initialization", () => {
    it("renders children correctly", () => {
      render(
        <ColorThemeProvider>
          <div data-testid="child">Test Child</div>
        </ColorThemeProvider>,
      );

      expect(screen.getByTestId("child")).toBeInTheDocument();
      expect(screen.getByTestId("child")).toHaveTextContent("Test Child");
    });

    it("uses default theme when no defaultTheme prop is provided", () => {
      render(
        <ColorThemeProvider>
          <TestComponent />
        </ColorThemeProvider>,
      );

      expect(screen.getByTestId("current-theme")).toHaveTextContent("default");
    });

    it("uses provided defaultTheme prop", () => {
      render(
        <ColorThemeProvider defaultTheme="amber">
          <TestComponent />
        </ColorThemeProvider>,
      );

      expect(screen.getByTestId("current-theme")).toHaveTextContent("amber");
    });

    it("uses custom storageKey when provided", async () => {
      const customKey = "my-custom-theme-key";
      localStorage.setItem(customKey, "blue");

      render(
        <ColorThemeProvider storageKey={customKey}>
          <TestComponent />
        </ColorThemeProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("current-theme")).toHaveTextContent("blue");
      });
    });
  });

  describe("LocalStorage Integration", () => {
    it("loads theme from localStorage on mount", async () => {
      localStorage.setItem("color-theme", "cyan");

      render(
        <ColorThemeProvider>
          <TestComponent />
        </ColorThemeProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("current-theme")).toHaveTextContent("cyan");
      });
    });

    it("saves theme to localStorage when changed", async () => {
      const user = userEvent.setup();

      render(
        <ColorThemeProvider>
          <TestComponent />
        </ColorThemeProvider>,
      );

      await user.click(screen.getByTestId("set-amber"));

      await waitFor(() => {
        expect(localStorage.getItem("color-theme")).toBe("amber");
      });
    });

    it("uses custom storage key for localStorage operations", async () => {
      const user = userEvent.setup();
      const customKey = "custom-color-key";

      render(
        <ColorThemeProvider storageKey={customKey}>
          <TestComponent />
        </ColorThemeProvider>,
      );

      await user.click(screen.getByTestId("set-blue"));

      await waitFor(() => {
        expect(localStorage.getItem(customKey)).toBe("blue");
        expect(localStorage.getItem("color-theme")).toBeNull();
      });
    });

    it("prioritizes localStorage value over defaultTheme", async () => {
      localStorage.setItem("color-theme", "pink");

      render(
        <ColorThemeProvider defaultTheme="green">
          <TestComponent />
        </ColorThemeProvider>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("current-theme")).toHaveTextContent("pink");
      });
    });
  });

  describe("DOM Attribute Management", () => {
    it("sets data-theme attribute on document root when theme is not default", async () => {
      const user = userEvent.setup();

      render(
        <ColorThemeProvider>
          <TestComponent />
        </ColorThemeProvider>,
      );

      await user.click(screen.getByTestId("set-amber"));

      await waitFor(() => {
        expect(document.documentElement.getAttribute("data-theme")).toBe(
          "amber",
        );
      });
    });

    it("removes data-theme attribute when theme is default", async () => {
      const user = userEvent.setup();

      render(
        <ColorThemeProvider defaultTheme="blue">
          <TestComponent />
        </ColorThemeProvider>,
      );

      // Wait for initial theme to be set
      await waitFor(() => {
        expect(document.documentElement.getAttribute("data-theme")).toBe(
          "blue",
        );
      });

      await user.click(screen.getByTestId("set-default"));

      await waitFor(() => {
        expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
      });
    });

    it("updates data-theme attribute when theme changes", async () => {
      const user = userEvent.setup();

      render(
        <ColorThemeProvider>
          <TestComponent />
        </ColorThemeProvider>,
      );

      await user.click(screen.getByTestId("set-amber"));
      await waitFor(() => {
        expect(document.documentElement.getAttribute("data-theme")).toBe(
          "amber",
        );
      });

      await user.click(screen.getByTestId("set-blue"));
      await waitFor(() => {
        expect(document.documentElement.getAttribute("data-theme")).toBe(
          "blue",
        );
      });
    });
  });

  describe("Theme Switching", () => {
    it("switches between different color themes", async () => {
      const user = userEvent.setup();

      render(
        <ColorThemeProvider>
          <TestComponent />
        </ColorThemeProvider>,
      );

      expect(screen.getByTestId("current-theme")).toHaveTextContent("default");

      await user.click(screen.getByTestId("set-amber"));
      await waitFor(() => {
        expect(screen.getByTestId("current-theme")).toHaveTextContent("amber");
      });

      await user.click(screen.getByTestId("set-blue"));
      await waitFor(() => {
        expect(screen.getByTestId("current-theme")).toHaveTextContent("blue");
      });
    });

    it("maintains theme state across re-renders", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <ColorThemeProvider>
          <TestComponent />
        </ColorThemeProvider>,
      );

      await user.click(screen.getByTestId("set-amber"));
      await waitFor(() => {
        expect(screen.getByTestId("current-theme")).toHaveTextContent("amber");
      });

      rerender(
        <ColorThemeProvider>
          <TestComponent />
        </ColorThemeProvider>,
      );

      expect(screen.getByTestId("current-theme")).toHaveTextContent("amber");
    });
  });

  describe("Multiple Consumers", () => {
    it("provides same theme value to multiple consumers", async () => {
      const user = userEvent.setup();

      function Consumer1() {
        const { colorTheme } = useColorTheme();
        return <div data-testid="consumer-1">{colorTheme}</div>;
      }

      function Consumer2() {
        const { colorTheme } = useColorTheme();
        return <div data-testid="consumer-2">{colorTheme}</div>;
      }

      render(
        <ColorThemeProvider>
          <TestComponent />
          <Consumer1 />
          <Consumer2 />
        </ColorThemeProvider>,
      );

      await user.click(screen.getByTestId("set-amber"));

      await waitFor(() => {
        expect(screen.getByTestId("current-theme")).toHaveTextContent("amber");
        expect(screen.getByTestId("consumer-1")).toHaveTextContent("amber");
        expect(screen.getByTestId("consumer-2")).toHaveTextContent("amber");
      });
    });

    it("updates all consumers when theme changes", async () => {
      const user = userEvent.setup();

      function Consumer() {
        const { colorTheme } = useColorTheme();
        return <div data-testid="consumer">{colorTheme}</div>;
      }

      render(
        <ColorThemeProvider>
          <TestComponent />
          <Consumer />
        </ColorThemeProvider>,
      );

      await user.click(screen.getByTestId("set-blue"));

      await waitFor(() => {
        expect(screen.getByTestId("current-theme")).toHaveTextContent("blue");
        expect(screen.getByTestId("consumer")).toHaveTextContent("blue");
      });
    });
  });
});

describe("useColorTheme Hook", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("throws error when used outside ColorThemeProvider", () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    expect(() => {
      renderHook(() => useColorTheme());
    }).toThrow("useColorTheme must be used within a ColorThemeProvider");

    consoleSpy.mockRestore();
  });

  it("returns colorTheme and setColorTheme", () => {
    const { result } = renderHook(() => useColorTheme(), {
      wrapper: ({ children }) => (
        <ColorThemeProvider>{children}</ColorThemeProvider>
      ),
    });

    expect(result.current).toHaveProperty("colorTheme");
    expect(result.current).toHaveProperty("setColorTheme");
    expect(typeof result.current.setColorTheme).toBe("function");
  });

  it("returns current theme value", () => {
    const { result } = renderHook(() => useColorTheme(), {
      wrapper: ({ children }) => (
        <ColorThemeProvider defaultTheme="emerald">
          {children}
        </ColorThemeProvider>
      ),
    });

    expect(result.current.colorTheme).toBe("emerald");
  });

  it("allows setting theme via setColorTheme", async () => {
    const { result } = renderHook(() => useColorTheme(), {
      wrapper: ({ children }) => (
        <ColorThemeProvider>{children}</ColorThemeProvider>
      ),
    });

    expect(result.current.colorTheme).toBe("default");

    act(() => {
      result.current.setColorTheme("orange");
    });

    await waitFor(() => {
      expect(result.current.colorTheme).toBe("orange");
    });
  });

  it("setColorTheme function is stable across renders", () => {
    const { result, rerender } = renderHook(() => useColorTheme(), {
      wrapper: ({ children }) => (
        <ColorThemeProvider>{children}</ColorThemeProvider>
      ),
    });

    const firstSetColorTheme = result.current.setColorTheme;

    rerender();

    expect(result.current.setColorTheme).toBe(firstSetColorTheme);
  });
});

describe("colorThemes Export", () => {
  it("exports array of color theme options", () => {
    expect(Array.isArray(colorThemes)).toBe(true);
    expect(colorThemes.length).toBeGreaterThan(0);
  });

  it("each theme has required properties", () => {
    colorThemes.forEach((theme) => {
      expect(theme).toHaveProperty("name");
      expect(theme).toHaveProperty("value");
      expect(theme).toHaveProperty("color");
      expect(typeof theme.name).toBe("string");
      expect(typeof theme.value).toBe("string");
      expect(typeof theme.color).toBe("string");
    });
  });

  it("includes all expected color themes", () => {
    const expectedThemes = [
      "default",
      "amber",
      "blue",
      "cyan",
      "emerald",
      "green",
      "orange",
      "pink",
      "red",
      "yellow",
    ];

    const themeValues = colorThemes.map((t) => t.value);
    expectedThemes.forEach((expected) => {
      expect(themeValues).toContain(expected);
    });
  });

  it("has unique theme values", () => {
    const values = colorThemes.map((t) => t.value);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it("color values are in oklch format", () => {
    colorThemes.forEach((theme) => {
      expect(theme.color).toMatch(/^oklch\(/);
    });
  });
});
