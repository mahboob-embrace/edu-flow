import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Switch } from "@/components/ui/switch";

describe("Switch", () => {
  it("renders correctly with default props", () => {
    render(<Switch />);
    const switchElement = screen.getByTestId("switch");
    const thumbElement = screen.getByTestId("switch-thumb");

    expect(switchElement).toBeInTheDocument();
    expect(thumbElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute("data-slot", "switch");
    expect(thumbElement).toHaveAttribute("data-slot", "switch-thumb");
    expect(switchElement).toHaveAttribute("aria-checked", "false");
    expect(switchElement).toHaveAttribute("data-state", "unchecked");
  });

  it("renders with defaultChecked=true", () => {
    render(<Switch defaultChecked />);
    const switchElement = screen.getByTestId("switch");
    expect(switchElement).toHaveAttribute("aria-checked", "true");
    expect(switchElement).toHaveAttribute("data-state", "checked");
  });

  it("toggles state when clicked", async () => {
    const user = userEvent.setup();
    render(<Switch />);
    const switchElement = screen.getByTestId("switch");

    expect(switchElement).toHaveAttribute("aria-checked", "false");

    await user.click(switchElement);
    expect(switchElement).toHaveAttribute("aria-checked", "true");
    expect(switchElement).toHaveAttribute("data-state", "checked");

    await user.click(switchElement);
    expect(switchElement).toHaveAttribute("aria-checked", "false");
    expect(switchElement).toHaveAttribute("data-state", "unchecked");
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<Switch disabled />);
    const switchElement = screen.getByTestId("switch");

    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveAttribute("aria-checked", "false");

    await user.click(switchElement);
    expect(switchElement).toHaveAttribute("aria-checked", "false");
  });

  it("applies custom className", () => {
    render(<Switch className="custom-class" />);
    const switchElement = screen.getByTestId("switch");
    expect(switchElement).toHaveClass("custom-class");
  });

  it("works with label", () => {
    render(
      <div className="flex items-center space-x-2">
        <label htmlFor="airplane-mode">Airplane Mode</label>
        <Switch id="airplane-mode" />
      </div>,
    );
    const switchElement = screen.getByLabelText(/airplane mode/i);
    expect(switchElement).toBeInTheDocument();
  });

  it("calls onCheckedChange when state changes", async () => {
    const user = userEvent.setup();
    const onCheckedChange = jest.fn();
    render(<Switch onCheckedChange={onCheckedChange} />);
    const switchElement = screen.getByTestId("switch");

    await user.click(switchElement);
    expect(onCheckedChange).toHaveBeenCalledWith(true);

    await user.click(switchElement);
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });
});
