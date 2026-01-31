import { cn } from "./utils";

describe("cn utility", () => {
  describe("Basic Functionality", () => {
    it("merges multiple class names", () => {
      expect(cn("class1", "class2", "class3")).toBe("class1 class2 class3");
    });

    it("handles single class name", () => {
      expect(cn("single-class")).toBe("single-class");
    });

    it("handles empty inputs", () => {
      expect(cn()).toBe("");
    });
  });

  describe("Conditional Classes", () => {
    it("filters out falsy values", () => {
      expect(cn("class1", false, "class2", null, "class3", undefined)).toBe(
        "class1 class2 class3",
      );
    });

    it("handles conditional expressions", () => {
      const isActive = true;
      const isDisabled = false;

      expect(cn("base", isActive && "active", isDisabled && "disabled")).toBe(
        "base active",
      );
    });

    it("handles empty strings", () => {
      expect(cn("class1", "", "class2")).toBe("class1 class2");
    });
  });

  describe("Tailwind Conflict Resolution", () => {
    it("resolves conflicting padding classes (last wins)", () => {
      expect(cn("p-4", "p-8")).toBe("p-8");
    });

    it("resolves conflicting text color classes", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    });

    it("resolves conflicting background classes", () => {
      expect(cn("bg-white", "bg-black", "bg-gray-100")).toBe("bg-gray-100");
    });

    it("keeps non-conflicting classes", () => {
      expect(cn("p-4", "m-2", "text-red-500")).toBe("p-4 m-2 text-red-500");
    });

    it("resolves complex conflicts", () => {
      expect(cn("px-4 py-2", "p-8")).toBe("p-8");
    });
  });

  describe("Arrays and Objects", () => {
    it("handles array inputs", () => {
      expect(cn(["class1", "class2"], "class3")).toBe("class1 class2 class3");
    });

    it("handles nested arrays", () => {
      expect(cn(["class1", ["class2", "class3"]])).toBe("class1 class2 class3");
    });

    it("handles object inputs with truthy values", () => {
      expect(
        cn({
          class1: true,
          class2: false,
          class3: true,
        }),
      ).toBe("class1 class3");
    });

    it("handles mixed array and object inputs", () => {
      expect(
        cn(["base", "extra"], {
          active: true,
          disabled: false,
        }),
      ).toBe("base extra active");
    });
  });

  describe("Edge Cases", () => {
    it("handles undefined values", () => {
      expect(cn(undefined, "class1", undefined)).toBe("class1");
    });

    it("handles null values", () => {
      expect(cn(null, "class1", null)).toBe("class1");
    });

    it("handles numeric zero", () => {
      expect(cn(0, "class1")).toBe("class1");
    });

    it("handles whitespace", () => {
      expect(cn("  class1  ", "  class2  ")).toBe("class1 class2");
    });

    it("handles duplicate classes", () => {
      // twMerge doesn't dedupe non-conflicting classes
      expect(cn("class1", "class1", "class2")).toBe("class1 class1 class2");
    });
  });

  describe("Real-World Scenarios", () => {
    it("handles button variant classes", () => {
      const variant = "primary";
      const size = "lg";

      expect(
        cn(
          "btn",
          variant === "primary" && "btn-primary",
          variant === "secondary" && "btn-secondary",
          size === "lg" && "btn-lg",
        ),
      ).toBe("btn btn-primary btn-lg");
    });

    it("handles responsive classes", () => {
      expect(cn("text-sm", "md:text-base", "lg:text-lg")).toBe(
        "text-sm md:text-base lg:text-lg",
      );
    });

    it("handles state-based classes", () => {
      const isLoading = true;
      const hasError = false;

      expect(
        cn(
          "button",
          isLoading && "opacity-50 cursor-wait",
          hasError && "border-red-500",
        ),
      ).toBe("button opacity-50 cursor-wait");
    });
  });
});
