import { Component, createSignal } from "solid-js";
import { TButtonElement } from "./TButtonElement";
import { WORK, PAUSE, TButton, RESET, generateButtons } from "./WORK";

interface ControlsProps {
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

function generateButtonClass(activeButton: Function, button: TButtonElement) {
  return `${button.id} ${activeButton() === button.id ? "active" : ""} ${button.cssClass || ""}`;
}

const Controls: Component<ControlsProps> = (props) => {
  const [activeButton, setActiveButton] = createSignal<
    typeof WORK | typeof PAUSE | null
  >(null);

  const handleButtonClick = (buttonType: TButton) => {
    prepareClickHandler(buttonType, setActiveButton, props, activeButton);
  };

  const buttons = generateButtons(handleButtonClick);

  return (
    <div class="controls">
      {buttons.map((button) => (
        <button
          class={generateButtonClass(activeButton, button)}
          onClick={button.action}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default Controls;
function prepareClickHandler(
  buttonType: string,
  setActiveButton: Function,
  props: ControlsProps,
  activeButton: Function,
) {
  switch (buttonType) {
    case WORK:
      setActiveButton(WORK);
      props.onStart();
      break;
    case PAUSE:
      // Toggle pause/resume based on current active state
      if (activeButton() === WORK) {
        props.onPause();
        setActiveButton(null); // Pause doesn't stay "down" in this context, it's a toggle action
      } else {
        // If it was null (meaning resumed after pause or initial state), treat as start/resume
        setActiveButton(WORK); // Assuming pause implies it was previously active, so we toggle back to start state
        props.onStart(); // This would effectively be a resume if paused
      }
      break;
    case RESET:
      // Reset is momentary, does not set an active state
      props.onReset();
      break;
  }
}
