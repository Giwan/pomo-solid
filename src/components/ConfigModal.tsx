import {
  Component,
  For,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import { Portal } from "solid-js/web";

type ModalDurations = {
  work: number;
  break: number;
  longBreak: number;
};

interface ConfigModalProps {
  durations: ModalDurations;
  onCancel: () => void;
  onSave: (minutes: ModalDurations) => void;
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

const ConfigModal: Component<ConfigModalProps> = (props) => {
  const [values, setValues] = createSignal<ModalDurations>({
    ...props.durations,
  });

  createEffect(() => {
    setValues({ ...props.durations });
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      props.onCancel();
    }
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown);
  });

  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyDown);
  });

  const updateField =
    (field: keyof ModalDurations) =>
    (event: InputEvent & { currentTarget: HTMLInputElement }) => {
      const nextValue = Number(event.currentTarget.value);
      setValues((prev) => ({
        ...prev,
        [field]: Number.isNaN(nextValue) ? prev[field] : nextValue,
      }));
    };

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    const current = values();
    const sanitized: ModalDurations = {
      work: sanitizeMinutes(current.work),
      break: sanitizeMinutes(current.break),
      longBreak: sanitizeMinutes(current.longBreak),
    };

    props.onSave(sanitized);
  };

  return (
    <Portal>
      <div class="modal-backdrop" onClick={props.onCancel}>
        <div
          class="modal-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="config-modal-title"
          onClick={(event) => event.stopPropagation()}
        >
          <div class="modal-header">
            <h2 id="config-modal-title">Timer Settings</h2>
            <p class="modal-subtitle">Set the minutes for each cycle below.</p>
          </div>
          <form class="modal-form" onSubmit={handleSubmit}>
            <div class="modal-grid">
              <For each={INPUT_FIELDS}>
                {(field) => NumberInput(field, values, updateField)}
              </For>
            </div>
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
          </form>
        </div>
      </div>
    </Portal>
  );
};

export default ConfigModal;

type TField =
  | {
      readonly key: "work";
      readonly label: "Work Session";
    }
  | {
      readonly key: "break";
      readonly label: "Break";
    }
  | {
      readonly key: "longBreak";
      readonly label: "Long Break";
    };

function NumberInput(
  field: TField,
  values,
  updateField: (
    field: keyof ModalDurations,
  ) => (event: InputEvent & { currentTarget: HTMLInputElement }) => void,
) {
  return (
    <label class="modal-row" for={`input-${field.key}`}>
      <span>{field.label}</span>
      <input
        id={`input-${field.key}`}
        type="number"
        min="1"
        max="120"
        step="1"
        value={values()[field.key]}
        onInput={updateField(field.key)}
        inputMode="numeric"
      />
      <span class="input-suffix">min</span>
    </label>
  );
}
