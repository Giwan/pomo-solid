import {
  Component,
  For,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { Portal } from "solid-js/web";
import { ModalDurations } from "../types";
import NumberInput from "./NumberInput";

interface ConfigModalProps {
  durations: ModalDurations;
  audioEnabled: boolean;
  flashWarningSeconds: number;
  onCancel: () => void;
  onSave: (minutes: ModalDurations, audioEnabled: boolean, flashWarning: number) => void;
}

const INPUT_FIELDS = [
  { key: "work", label: "Work Session" },
  { key: "break", label: "Break" },
  { key: "longBreak", label: "Long Break" },
] as const;

const sanitizeMinutes = (value: number) => {
  if (!Number.isFinite(value)) return 1;
  return Math.max(1, Math.round(value));
};

function isEscapeKey(event: KeyboardEvent) {
  return event.key === "Escape";
}

function getSanitizedValues(current: ModalDurations): ModalDurations {
  return {
    work: sanitizeMinutes(current.work),
    break: sanitizeMinutes(current.break),
    longBreak: sanitizeMinutes(current.longBreak),
  };  
}

const ConfigModal: Component<ConfigModalProps> = (props) => {
  const [values, setValues] = createSignal<ModalDurations>({
    ...props.durations,
  });
  const [audioEnabled, setAudioEnabled] = createSignal(props.audioEnabled);
  const [flashWarning, setFlashWarning] = createSignal(props.flashWarningSeconds);

  createEffect(() => {
    setValues({ ...props.durations });
    setAudioEnabled(props.audioEnabled);
    setFlashWarning(props.flashWarningSeconds);
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (isEscapeKey(event)) props.onCancel();
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  const handleInputChange = (field: keyof ModalDurations, value: number) => {
    if (Number.isNaN(value)) return;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleFlashWarningChange = (e: InputEvent) => {
    const val = parseInt((e.target as HTMLInputElement).value, 10);
    if (!Number.isNaN(val) && val >= 1 && val <= 30) {
      setFlashWarning(val);
    }
  };

  const handleAudioEnabledChange = (e: Event) => {
    setAudioEnabled((e.target as HTMLInputElement).checked);
  };

  const handlePanelClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    props.onSave(getSanitizedValues(values()), audioEnabled(), flashWarning());
  };

  return (
    <Portal>
      <div class="modal-backdrop" onClick={props.onCancel}>
        <div
          class="modal-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="config-modal-title"
          onClick={handlePanelClick}
        >
          <ModalHeader />
          <form class="modal-form" onSubmit={handleSubmit}>
            <div class="modal-grid">
              <For each={INPUT_FIELDS}>
                {(field) => (
                  <NumberInput
                    field={field}
                    value={values()[field.key]}
                    onInput={(val) => handleInputChange(field.key, val)}
                  />
                )}
              </For>
            </div>
            
            <div class="modal-option">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  checked={audioEnabled()}
                  onChange={handleAudioEnabledChange}
                />
                <span>Play sound when timer ends</span>
              </label>
            </div>
            <div class="modal-option">
              <label class="number-label">
                <span>Flash warning (seconds)</span>
                <input
                  type="number"
                  class="number-input"
                  min="1"
                  max="30"
                  value={flashWarning()}
                  onInput={handleFlashWarningChange}
                />
              </label>
            </div>
            <ActionButtons onCancel={props.onCancel} />
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default ConfigModal;


function ModalHeader() {
  return (
    <div class="modal-header">
      <h2 id="config-modal-title">Timer Settings</h2>
      <p class="modal-subtitle">Set the minutes for each cycle below.</p>
    </div>
  )
}

type ActionButtonsProps = {
  onCancel: () => void;
};

function ActionButtons(props: ActionButtonsProps) {
  return (
    <div class="modal-actions">
      <button
        type="button"
        class="modal-button modal-button--secondary"
        onClick={props.onCancel}
      >
        Cancel
      </button>
      <button type="submit" class="modal-button modal-button--primary">
        Save
      </button>
    </div>
  )
}
