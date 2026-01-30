import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

describe("Tabs", () => {
  it("renders correctly with default props", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );

    expect(screen.getByTestId("tabs")).toBeInTheDocument();
    expect(screen.getByTestId("tabs-list")).toBeInTheDocument();
    expect(screen.getAllByTestId("tabs-trigger")).toHaveLength(2);

    expect(screen.getByText("Content 1")).toBeInTheDocument();
  });

  it("switches content when a different trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );

    const trigger2 = screen.getByRole("tab", { name: /tab 2/i });
    await user.click(trigger2);

    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.queryByText("Content 1")).not.toBeInTheDocument();
  });

  it("applies custom classNames", () => {
    render(
      <Tabs className="custom-tabs" defaultValue="tab1">
        <TabsList className="custom-list">
          <TabsTrigger className="custom-trigger" value="tab1">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent className="custom-content" value="tab1">
          Content 1
        </TabsContent>
      </Tabs>,
    );

    expect(screen.getByTestId("tabs")).toHaveClass("custom-tabs");
    expect(screen.getByTestId("tabs-list")).toHaveClass("custom-list");
    expect(screen.getByTestId("tabs-trigger")).toHaveClass("custom-trigger");
    expect(screen.getByText("Content 1")).toHaveClass("custom-content");
  });

  it("disables triggers when requested", () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2" disabled>
            Tab 2
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
      </Tabs>,
    );

    const trigger2 = screen.getByRole("tab", { name: /tab 2/i });
    expect(trigger2).toBeDisabled();
  });

  it("forwards props correctly", () => {
    render(
      <Tabs data-custom="root" defaultValue="tab1">
        <TabsList data-custom="list">
          <TabsTrigger data-custom="trigger" value="tab1">
            Tab 1
          </TabsTrigger>
        </TabsList>
        <TabsContent data-custom="content" value="tab1">
          Content 1
        </TabsContent>
      </Tabs>,
    );

    expect(screen.getByTestId("tabs")).toHaveAttribute("data-custom", "root");
    expect(screen.getByTestId("tabs-list")).toHaveAttribute(
      "data-custom",
      "list",
    );
    expect(screen.getByTestId("tabs-trigger")).toHaveAttribute(
      "data-custom",
      "trigger",
    );
    expect(screen.getByText("Content 1")).toHaveAttribute(
      "data-custom",
      "content",
    );
  });
});
