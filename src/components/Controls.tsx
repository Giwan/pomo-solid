import { Component, createSignal } from "solid-js";

interface ControlsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

const Controls: Component<ControlsProps> = (props) => {
  const [activeButton, setActiveButton] = createSignal<
    "start" | "pause" | null
  >(null);

  const handleButtonClick = (buttonType: "start" | "pause" | "reset") => {
    switch (buttonType) {
      case "start":
        setActiveButton("start");
        props.onStart();
        break;
      case "pause":
        // Toggle pause/resume based on current active state
        if (activeButton() === "start") {
          props.onPause();
          setActiveButton(null); // Pause doesn't stay "down" in this context, it's a toggle action
        } else {
          // If it was null (meaning resumed after pause or initial state), treat as start/resume
          setActiveButton("start"); // Assuming pause implies it was previously active, so we toggle back to start state
          props.onStart(); // This would effectively be a resume if paused
        }
        break;
      case "reset":
        // Reset is momentary, does not set an active state
        props.onReset();
        break;
    }
  };

  const buttons = [
    {
      id: "start",
      label: "Start",
      action: () => handleButtonClick("start"),
      cssClass: "start-button",
    },
    {
      id: "pause",
      label: "Pause",
      action: () => handleButtonClick("pause"),
    },
    {
      id: "reset",
      label: "Reset",
      action: () => handleButtonClick("reset"),
    },
  ];

  return (
    <div class="controls">
      {buttons.map((button) => (
        <button
          class={`${button.id} ${activeButton() === button.id ? "active" : ""} ${button.cssClass || ""}`}
          onClick={button.action}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default Controls;
