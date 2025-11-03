import { Component, JSX } from "solid-js";

type TileIntent = "work" | "break" | "longBreak" | "neutral";
type TileVariant = "mode" | "action";

interface TileButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  active?: boolean;
  intent?: TileIntent;
  variant?: TileVariant;
}

function getClasses(active: string, className: string) {
  return [
    "tile-button",
    `tile-button--${variant}`,
    active ? "is-active" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
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

  return (
    <button
      type="button"
      {...buttonProps}
      class={getClasses(active, className)}
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
