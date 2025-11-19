import { Component } from "solid-js";
import { Mode } from "../types";

interface PomHeaderProps {
  currentMode: { id: Mode; label: string };
}

const PomHeader: Component<PomHeaderProps> = (props) => {
  return (
    <header class="timer-header">
      <div class="header-titles">
        <span class="eyebrow">Focus Flow</span>
        <h1 class="header-title">Pomodoro</h1>
      </div>
      <div class="mode-chip" data-mode={props.currentMode.id}>
        <span class="chip-dot" aria-hidden="true" />
        <span>{props.currentMode.label}</span>
      </div>
    </header>
  );
};

export default PomHeader;
