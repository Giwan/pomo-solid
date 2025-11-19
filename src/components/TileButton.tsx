import { Component, JSX } from "solid-js";

interface TileButtonProps {
  icon: JSX.Element;
  label: string;
  intent: string;
  variant: "mode" | "action";
  active?: boolean;
  onClick: () => void;
}

const TileButton: Component<TileButtonProps> = (props) => {
  return (
    <button
      class={`tile-button ${props.active ? "active" : ""}`}
      onClick={props.onClick}
      aria-label={props.label}
      title={props.label}
    >
      <div class="tile-icon">{props.icon}</div>
      <span class="tile-label">{props.label}</span>
    </button>
  );
};

export default TileButton;
