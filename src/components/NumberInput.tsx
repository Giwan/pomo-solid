import { Component } from "solid-js";
import { ModalDurations, TField } from "../types";


interface NumberInputProps {
  field: TField;
  value: number;
  onInput: (value: number) => void;
}

const NumberInput: Component<NumberInputProps> = (props) => {
  return (
    <div class="modal-row" style={{ display: "contents" }}>
      <label class="modal-cell-label" for={`input-${props.field.key}`}>
        {props.field.label}
      </label>
      <div class="modal-cell-input">
        <input
          id={`input-${props.field.key}`}
          type="number"
          min="1"
          max="120"
          step="1"
          value={props.value}
          onInput={(e) => props.onInput(Number(e.currentTarget.value))}
          inputMode="numeric"
        />
        <span class="input-suffix">min</span>
      </div>
    </div>
  );
};

export default NumberInput;
