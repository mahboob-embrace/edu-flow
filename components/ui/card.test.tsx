import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "./card";

describe("Card Components", () => {
  describe("Card", () => {
    it("renders successfully", () => {
      render(<Card data-testid="card">Card Content</Card>);

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByText("Card Content")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      render(<Card data-testid="card">Content</Card>);

      expect(screen.getByTestId("card")).toHaveAttribute("data-slot", "card");
    });

    it("applies default classes", () => {
      render(<Card data-testid="card">Content</Card>);

      const card = screen.getByTestId("card");
      expect(card).toHaveClass("bg-card");
      expect(card).toHaveClass("text-card-foreground");
      expect(card).toHaveClass("flex");
      expect(card).toHaveClass("flex-col");
      expect(card).toHaveClass("gap-6");
      expect(card).toHaveClass("rounded-xl");
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("py-6");
      expect(card).toHaveClass("shadow-sm");
    });

    it("accepts custom className", () => {
      render(
        <Card data-testid="card" className="custom-card">
          Content
        </Card>,
      );

      const card = screen.getByTestId("card");
      expect(card).toHaveClass("custom-card");
      expect(card).toHaveClass("bg-card"); // Still has default classes
    });

    it("forwards additional props", () => {
      render(
        <Card data-testid="card" title="Card Title" role="region">
          Content
        </Card>,
      );

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("title", "Card Title");
      expect(card).toHaveAttribute("role", "region");
    });

    it("renders as a div element", () => {
      render(<Card data-testid="card">Content</Card>);

      const card = screen.getByTestId("card");
      expect(card.tagName).toBe("DIV");
    });
  });

  describe("CardHeader", () => {
    it("renders successfully", () => {
      render(<CardHeader data-testid="card-header">Header Content</CardHeader>);

      expect(screen.getByTestId("card-header")).toBeInTheDocument();
      expect(screen.getByText("Header Content")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      render(<CardHeader data-testid="card-header">Header</CardHeader>);

      expect(screen.getByTestId("card-header")).toHaveAttribute(
        "data-slot",
        "card-header",
      );
    });

    it("applies default classes", () => {
      render(<CardHeader data-testid="card-header">Header</CardHeader>);

      const header = screen.getByTestId("card-header");
      expect(header).toHaveClass("@container/card-header");
      expect(header).toHaveClass("grid");
      expect(header).toHaveClass("auto-rows-min");
      expect(header).toHaveClass("grid-rows-[auto_auto]");
      expect(header).toHaveClass("items-start");
      expect(header).toHaveClass("gap-2");
      expect(header).toHaveClass("px-6");
    });

    it("accepts custom className", () => {
      render(
        <CardHeader data-testid="card-header" className="custom-header">
          Header
        </CardHeader>,
      );

      const header = screen.getByTestId("card-header");
      expect(header).toHaveClass("custom-header");
      expect(header).toHaveClass("grid");
    });
  });

  describe("CardTitle", () => {
    it("renders successfully", () => {
      render(<CardTitle>Card Title</CardTitle>);

      expect(screen.getByText("Card Title")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      render(<CardTitle data-testid="card-title">Title</CardTitle>);

      expect(screen.getByTestId("card-title")).toHaveAttribute(
        "data-slot",
        "card-title",
      );
    });

    it("applies default classes", () => {
      render(<CardTitle data-testid="card-title">Title</CardTitle>);

      const title = screen.getByTestId("card-title");
      expect(title).toHaveClass("leading-none");
      expect(title).toHaveClass("font-semibold");
    });

    it("accepts custom className", () => {
      render(
        <CardTitle data-testid="card-title" className="text-2xl">
          Title
        </CardTitle>,
      );

      const title = screen.getByTestId("card-title");
      expect(title).toHaveClass("text-2xl");
      expect(title).toHaveClass("font-semibold");
    });
  });

  describe("CardDescription", () => {
    it("renders successfully", () => {
      render(<CardDescription>Card Description</CardDescription>);

      expect(screen.getByText("Card Description")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      render(
        <CardDescription data-testid="card-description">
          Description
        </CardDescription>,
      );

      expect(screen.getByTestId("card-description")).toHaveAttribute(
        "data-slot",
        "card-description",
      );
    });

    it("applies default classes", () => {
      render(
        <CardDescription data-testid="card-description">
          Description
        </CardDescription>,
      );

      const description = screen.getByTestId("card-description");
      expect(description).toHaveClass("text-muted-foreground");
      expect(description).toHaveClass("text-sm");
    });

    it("accepts custom className", () => {
      render(
        <CardDescription data-testid="card-description" className="text-base">
          Description
        </CardDescription>,
      );

      const description = screen.getByTestId("card-description");
      expect(description).toHaveClass("text-base");
      expect(description).toHaveClass("text-muted-foreground");
    });
  });

  describe("CardAction", () => {
    it("renders successfully", () => {
      render(<CardAction data-testid="card-action">Action Button</CardAction>);

      expect(screen.getByTestId("card-action")).toBeInTheDocument();
      expect(screen.getByText("Action Button")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      render(<CardAction data-testid="card-action">Action</CardAction>);

      expect(screen.getByTestId("card-action")).toHaveAttribute(
        "data-slot",
        "card-action",
      );
    });

    it("applies default classes", () => {
      render(<CardAction data-testid="card-action">Action</CardAction>);

      const action = screen.getByTestId("card-action");
      expect(action).toHaveClass("col-start-2");
      expect(action).toHaveClass("row-span-2");
      expect(action).toHaveClass("row-start-1");
      expect(action).toHaveClass("self-start");
      expect(action).toHaveClass("justify-self-end");
    });

    it("accepts custom className", () => {
      render(
        <CardAction data-testid="card-action" className="custom-action">
          Action
        </CardAction>,
      );

      const action = screen.getByTestId("card-action");
      expect(action).toHaveClass("custom-action");
      expect(action).toHaveClass("col-start-2");
    });
  });

  describe("CardContent", () => {
    it("renders successfully", () => {
      render(<CardContent>Card Content</CardContent>);

      expect(screen.getByText("Card Content")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      render(<CardContent data-testid="card-content">Content</CardContent>);

      expect(screen.getByTestId("card-content")).toHaveAttribute(
        "data-slot",
        "card-content",
      );
    });

    it("applies default classes", () => {
      render(<CardContent data-testid="card-content">Content</CardContent>);

      const content = screen.getByTestId("card-content");
      expect(content).toHaveClass("px-6");
    });

    it("accepts custom className", () => {
      render(
        <CardContent data-testid="card-content" className="py-4">
          Content
        </CardContent>,
      );

      const content = screen.getByTestId("card-content");
      expect(content).toHaveClass("py-4");
      expect(content).toHaveClass("px-6");
    });
  });

  describe("CardFooter", () => {
    it("renders successfully", () => {
      render(<CardFooter>Footer Content</CardFooter>);

      expect(screen.getByText("Footer Content")).toBeInTheDocument();
    });

    it("has correct data-slot attribute", () => {
      render(<CardFooter data-testid="card-footer">Footer</CardFooter>);

      expect(screen.getByTestId("card-footer")).toHaveAttribute(
        "data-slot",
        "card-footer",
      );
    });

    it("applies default classes", () => {
      render(<CardFooter data-testid="card-footer">Footer</CardFooter>);

      const footer = screen.getByTestId("card-footer");
      expect(footer).toHaveClass("flex");
      expect(footer).toHaveClass("items-center");
      expect(footer).toHaveClass("px-6");
    });

    it("accepts custom className", () => {
      render(
        <CardFooter data-testid="card-footer" className="justify-end">
          Footer
        </CardFooter>,
      );

      const footer = screen.getByTestId("card-footer");
      expect(footer).toHaveClass("justify-end");
      expect(footer).toHaveClass("flex");
    });
  });

  describe("Complete Card Integration", () => {
    it("renders a complete card with all components", () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader data-testid="card-header">
            <CardTitle data-testid="card-title">Test Card</CardTitle>
            <CardDescription data-testid="card-description">
              This is a test card
            </CardDescription>
            <CardAction data-testid="card-action">
              <button type="button">Action</button>
            </CardAction>
          </CardHeader>
          <CardContent data-testid="card-content">
            Main content goes here
          </CardContent>
          <CardFooter data-testid="card-footer">Footer content</CardFooter>
        </Card>,
      );

      expect(screen.getByTestId("complete-card")).toBeInTheDocument();
      expect(screen.getByTestId("card-header")).toBeInTheDocument();
      expect(screen.getByTestId("card-title")).toHaveTextContent("Test Card");
      expect(screen.getByTestId("card-description")).toHaveTextContent(
        "This is a test card",
      );
      expect(screen.getByTestId("card-action")).toBeInTheDocument();
      expect(screen.getByTestId("card-content")).toHaveTextContent(
        "Main content goes here",
      );
      expect(screen.getByTestId("card-footer")).toHaveTextContent(
        "Footer content",
      );
    });

    it("renders card without header", () => {
      render(
        <Card data-testid="card">
          <CardContent>Content only</CardContent>
        </Card>,
      );

      expect(screen.getByTestId("card")).toBeInTheDocument();
      expect(screen.getByText("Content only")).toBeInTheDocument();
    });

    it("renders card without footer", () => {
      render(
        <Card data-testid="card">
          <CardHeader>
            <CardTitle>Title</CardTitle>
          </CardHeader>
          <CardContent>Content</CardContent>
        </Card>,
      );

      expect(screen.getByText("Title")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders card with only title and content", () => {
      render(
        <Card data-testid="card">
          <CardHeader>
            <CardTitle>Simple Card</CardTitle>
          </CardHeader>
          <CardContent>Simple content</CardContent>
        </Card>,
      );

      expect(screen.getByText("Simple Card")).toBeInTheDocument();
      expect(screen.getByText("Simple content")).toBeInTheDocument();
    });

    it("renders multiple cards independently", () => {
      render(
        <div>
          <Card data-testid="card-1">
            <CardHeader>
              <CardTitle>Card 1</CardTitle>
            </CardHeader>
          </Card>
          <Card data-testid="card-2">
            <CardHeader>
              <CardTitle>Card 2</CardTitle>
            </CardHeader>
          </Card>
        </div>,
      );

      expect(screen.getByTestId("card-1")).toBeInTheDocument();
      expect(screen.getByTestId("card-2")).toBeInTheDocument();
      expect(screen.getByText("Card 1")).toBeInTheDocument();
      expect(screen.getByText("Card 2")).toBeInTheDocument();
    });
  });

  describe("Content Variations", () => {
    it("renders card with React elements in content", () => {
      render(
        <Card>
          <CardContent>
            <p>Paragraph 1</p>
            <p>Paragraph 2</p>
          </CardContent>
        </Card>,
      );

      expect(screen.getByText("Paragraph 1")).toBeInTheDocument();
      expect(screen.getByText("Paragraph 2")).toBeInTheDocument();
    });

    it("renders card with nested components", () => {
      render(
        <Card>
          <CardContent>
            <div>
              <span>Nested</span> <strong>Content</strong>
            </div>
          </CardContent>
        </Card>,
      );

      expect(screen.getByText("Nested")).toBeInTheDocument();
      expect(screen.getByText("Content")).toBeInTheDocument();
    });

    it("renders card with empty content", () => {
      render(
        <Card data-testid="card">
          <CardContent data-testid="empty-content"></CardContent>
        </Card>,
      );

      const content = screen.getByTestId("empty-content");
      expect(content).toBeInTheDocument();
      expect(content).toBeEmptyDOMElement();
    });
  });

  describe("Accessibility", () => {
    it("supports aria-label on card", () => {
      render(
        <Card aria-label="Product card" data-testid="card">
          <CardContent>Content</CardContent>
        </Card>,
      );

      const card = screen.getByLabelText("Product card");
      expect(card).toBeInTheDocument();
    });

    it("supports aria-describedby", () => {
      render(
        <div>
          <Card aria-describedby="card-desc" data-testid="card">
            <CardContent>Content</CardContent>
          </Card>
          <p id="card-desc">Card description</p>
        </div>,
      );

      const card = screen.getByTestId("card");
      expect(card).toHaveAttribute("aria-describedby", "card-desc");
    });

    it("supports role attribute", () => {
      render(
        <Card role="article" data-testid="card">
          <CardContent>Article content</CardContent>
        </Card>,
      );

      const card = screen.getByRole("article");
      expect(card).toBeInTheDocument();
    });

    it("title can have heading role", () => {
      render(
        <CardHeader>
          <CardTitle role="heading" aria-level={2}>
            Heading Title
          </CardTitle>
        </CardHeader>,
      );

      const title = screen.getByRole("heading");
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute("aria-level", "2");
    });
  });

  describe("Event Handlers", () => {
    it("handles onClick on card", () => {
      const handleClick = jest.fn();

      render(
        <Card data-testid="card" onClick={handleClick}>
          <CardContent>Clickable Card</CardContent>
        </Card>,
      );

      const card = screen.getByTestId("card");
      card.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles onClick on footer button", () => {
      const handleClick = jest.fn();

      render(
        <Card>
          <CardFooter>
            <button type="button" onClick={handleClick}>
              Submit
            </button>
          </CardFooter>
        </Card>,
      );

      const button = screen.getByRole("button", { name: "Submit" });
      button.click();

      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Styling Combinations", () => {
    it("applies custom classes to all components", () => {
      render(
        <Card data-testid="card" className="custom-card">
          <CardHeader data-testid="header" className="custom-header">
            <CardTitle data-testid="title" className="custom-title">
              Title
            </CardTitle>
            <CardDescription
              data-testid="description"
              className="custom-description"
            >
              Description
            </CardDescription>
          </CardHeader>
          <CardContent data-testid="content" className="custom-content">
            Content
          </CardContent>
          <CardFooter data-testid="footer" className="custom-footer">
            Footer
          </CardFooter>
        </Card>,
      );

      expect(screen.getByTestId("card")).toHaveClass("custom-card");
      expect(screen.getByTestId("header")).toHaveClass("custom-header");
      expect(screen.getByTestId("title")).toHaveClass("custom-title");
      expect(screen.getByTestId("description")).toHaveClass(
        "custom-description",
      );
      expect(screen.getByTestId("content")).toHaveClass("custom-content");
      expect(screen.getByTestId("footer")).toHaveClass("custom-footer");
    });

    it("maintains default classes with custom classes", () => {
      render(
        <Card data-testid="card" className="bg-blue-500">
          <CardContent>Content</CardContent>
        </Card>,
      );

      const card = screen.getByTestId("card");
      expect(card).toHaveClass("bg-blue-500");
      expect(card).toHaveClass("rounded-xl");
      expect(card).toHaveClass("border");
    });
  });
});
