import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "./dropdown-menu";

describe("DropdownMenu Components", () => {
  describe("Basic Rendering", () => {
    it("renders trigger button", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">
            Open Menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByTestId("trigger")).toBeInTheDocument();
      expect(screen.getByText("Open Menu")).toBeInTheDocument();
    });

    it("trigger has correct data-slot attribute", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByTestId("trigger")).toHaveAttribute(
        "data-slot",
        "dropdown-menu-trigger",
      );
    });

    it("does not show content initially", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Hidden Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.queryByText("Hidden Item")).not.toBeInTheDocument();
    });
  });

  describe("Opening and Closing", () => {
    it("opens menu when trigger is clicked", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">
            Open Menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem data-testid="menu-item">
              Menu Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("menu-item")).toBeInTheDocument();
      });
    });

    it.skip("closes menu when clicking outside", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Menu Item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button type="button" data-testid="outside-button">
            Outside
          </button>
        </div>,
      );

      // Open menu
      await user.click(screen.getByText("Open Menu"));
      await waitFor(() => {
        expect(screen.getByText("Menu Item")).toBeInTheDocument();
      });

      // Click outside using fireEvent (works better with Radix UI portals)
      const outsideButton = screen.getByTestId("outside-button");
      fireEvent.click(outsideButton);

      await waitFor(() => {
        expect(screen.queryByText("Menu Item")).not.toBeInTheDocument();
      });
    });

    it("closes menu when pressing Escape", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">
            Open Menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem data-testid="menu-item">
              Menu Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      // Open menu
      await user.click(screen.getByTestId("trigger"));
      await waitFor(() => {
        expect(screen.getByTestId("menu-item")).toBeInTheDocument();
      });

      // Press Escape
      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByTestId("menu-item")).not.toBeInTheDocument();
      });
    });
  });

  describe("DropdownMenuItem", () => {
    it("renders menu items", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
            <DropdownMenuItem>Item 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByText("Open"));

      await waitFor(() => {
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
        expect(screen.getByText("Item 3")).toBeInTheDocument();
      });
    });

    it("handles click on menu item", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              data-testid="clickable-item"
              onSelect={handleClick}
            >
              Clickable Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));
      await waitFor(() => {
        expect(screen.getByTestId("clickable-item")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("clickable-item"));

      expect(handleClick).toHaveBeenCalled();
    });

    it("renders destructive variant", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              variant="destructive"
              data-testid="destructive-item"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        const item = screen.getByTestId("destructive-item");
        expect(item).toHaveAttribute("data-variant", "destructive");
      });
    });

    it("renders with inset prop", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem inset data-testid="inset-item">
              Inset Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByText("Open"));

      await waitFor(() => {
        const item = screen.getByTestId("inset-item");
        expect(item).toHaveAttribute("data-inset", "true");
      });
    });

    it("supports disabled state", async () => {
      const handleClick = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled onSelect={handleClick}>
              Disabled Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByText("Open"));
      await waitFor(() => {
        expect(screen.getByText("Disabled Item")).toBeInTheDocument();
      });

      const disabledItem = screen.getByText("Disabled Item");
      await user.click(disabledItem);

      // Handler should not be called for disabled item
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe("DropdownMenuCheckboxItem", () => {
    it("renders checkbox items", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={false}
              data-testid="unchecked-item"
            >
              Unchecked
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true} data-testid="checked-item">
              Checked
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("unchecked-item")).toBeInTheDocument();
        expect(screen.getByTestId("checked-item")).toBeInTheDocument();
      });
    });

    it("toggles checkbox state", async () => {
      const handleCheckedChange = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={handleCheckedChange}
              data-testid="toggle-item"
            >
              Toggle Me
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));
      await waitFor(() => {
        expect(screen.getByTestId("toggle-item")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("toggle-item"));

      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  describe("DropdownMenuRadioGroup and RadioItem", () => {
    it("renders radio group with items", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1" data-testid="option-1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2" data-testid="option-2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("option-1")).toBeInTheDocument();
        expect(screen.getByTestId("option-2")).toBeInTheDocument();
      });
    });

    it("handles radio selection change", async () => {
      const handleValueChange = jest.fn();
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value="option1"
              onValueChange={handleValueChange}
            >
              <DropdownMenuRadioItem value="option1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2" data-testid="option-2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));
      await waitFor(() => {
        expect(screen.getByTestId("option-2")).toBeInTheDocument();
      });

      await user.click(screen.getByTestId("option-2"));

      expect(handleValueChange).toHaveBeenCalledWith("option2");
    });
  });

  describe("DropdownMenuLabel", () => {
    it("renders label", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel data-testid="menu-label">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("menu-label")).toBeInTheDocument();
      });
    });

    it("renders label with inset", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel inset data-testid="inset-label">
              Label
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByText("Open"));

      await waitFor(() => {
        const label = screen.getByTestId("inset-label");
        expect(label).toHaveAttribute("data-inset", "true");
      });
    });
  });

  describe("DropdownMenuSeparator", () => {
    it("renders separator", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator data-testid="separator" />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("separator")).toBeInTheDocument();
        expect(screen.getByTestId("separator")).toHaveAttribute(
          "data-slot",
          "dropdown-menu-separator",
        );
      });
    });
  });

  describe("DropdownMenuShortcut", () => {
    it("renders keyboard shortcut", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Save
              <DropdownMenuShortcut data-testid="shortcut">
                ⌘S
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("shortcut")).toBeInTheDocument();
        expect(screen.getByText("⌘S")).toBeInTheDocument();
      });
    });
  });

  describe("DropdownMenuGroup", () => {
    it("renders grouped items", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Group Item 1</DropdownMenuItem>
              <DropdownMenuItem>Group Item 2</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByText("Open"));

      await waitFor(() => {
        expect(screen.getByText("Group Item 1")).toBeInTheDocument();
        expect(screen.getByText("Group Item 2")).toBeInTheDocument();
      });
    });
  });

  describe("Submenu", () => {
    it("renders submenu trigger", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger data-testid="sub-trigger">
                More Options
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("sub-trigger")).toBeInTheDocument();
        expect(screen.getByText("More Options")).toBeInTheDocument();
      });
    });

    it("submenu trigger has inset support", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger inset data-testid="sub-trigger">
                Submenu
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        const trigger = screen.getByTestId("sub-trigger");
        expect(trigger).toHaveAttribute("data-inset", "true");
      });
    });
  });

  describe("Accessibility", () => {
    it("trigger is keyboard accessible", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">
            Open Menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem data-testid="item">Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      const trigger = screen.getByTestId("trigger");
      trigger.focus();
      expect(trigger).toHaveFocus();

      // Open with Enter
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(screen.getByTestId("item")).toBeInTheDocument();
      });
    });

    it("supports aria-label on trigger", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger aria-label="User menu">Menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      expect(screen.getByLabelText("User menu")).toBeInTheDocument();
    });
  });

  describe("Custom Styling", () => {
    it("accepts custom className on content", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent className="custom-content" data-testid="content">
            <DropdownMenuItem>Item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        const content = screen.getByTestId("content");
        expect(content).toHaveClass("custom-content");
      });
    });

    it("accepts custom className on items", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">Open</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="custom-item" data-testid="item">
              Custom Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        const item = screen.getByTestId("item");
        expect(item).toHaveClass("custom-item");
      });
    });
  });

  describe("Complex Menu Structure", () => {
    it("renders complete menu with all components", async () => {
      const user = userEvent.setup();

      render(
        <DropdownMenu>
          <DropdownMenuTrigger data-testid="trigger">
            Open Menu
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel data-testid="account-label">
              My Account
            </DropdownMenuLabel>
            <DropdownMenuSeparator data-testid="separator-1" />
            <DropdownMenuGroup data-testid="group-1">
              <DropdownMenuItem data-testid="profile-item">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="settings-item">
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator data-testid="separator-2" />
            <DropdownMenuCheckboxItem checked={true} data-testid="notif-item">
              Show Notifications
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator data-testid="separator-3" />
            <DropdownMenuItem variant="destructive" data-testid="logout-item">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>,
      );

      await user.click(screen.getByTestId("trigger"));

      await waitFor(() => {
        expect(screen.getByTestId("account-label")).toBeInTheDocument();
        expect(screen.getByTestId("profile-item")).toBeInTheDocument();
        expect(screen.getByTestId("settings-item")).toBeInTheDocument();
        expect(screen.getByTestId("notif-item")).toBeInTheDocument();
        expect(screen.getByTestId("logout-item")).toBeInTheDocument();
      });
    });
  });
});
