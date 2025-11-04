import { Component, JSX } from "solid-js";

type TileIntent = "work" | "break" | "longBreak" | "neutral";
type TileVariant = "mode" | "action";

interface TileButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: JSX.Element;
  label: string;
  active?: boolean;
  intent?: TileIntent;
  variant?: TileVariant;
}

const TileButton: Component<TileButtonProps> = (props) => {
  const {
    icon,
    label,
    active,
    intent = "neutral",
    variant = "mode",
    class: className,
    ...buttonProps
  } = props;

  const getClasses = () =>
    [
      "tile-button",
      `tile-button--${variant}`,
      active ? "is-active" : "",
      className ?? "",
    ]
      .filter(Boolean)
      .join(" ");

  return (
    <button
      type="button"
      {...buttonProps}
      class={getClasses()}
      data-intent={intent}
    >
      <span class="tile-icon" aria-hidden="true">
        {icon}
      </span>
      <span class="tile-label">{label}</span>
    </button>
  );
};

export default TileButton;
