import { Component, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import TimerDisplay from "./components/TimerDisplay";
import TileButton from "./components/TileButton";
import ConfigModal from "./components/ConfigModal";
import ProgressBar from "./components/ProgressBar";
import PomHeader from "./components/PomHeader";
import usePomodoro from "./hooks/usePomodoro";
import { MODE_DEFINITIONS } from "./types";
import {
  IconReset,
  IconSettings,
} from "./components/icons";
import "./App.css";

const App: Component = () => {
  const {
    activeMode,
    durations,
    isConfigOpen,
    minutes,
    seconds,
    isRunning,
    currentMode,
    transportIcon,
    pauseLabel,
    durationsInMinutes,
    setMode,
    togglePause,
    resetTimer,
    saveConfig,
    closeConfig,
    openConfig,
    time,
  } = usePomodoro();

  return (
    <div class="app-shell">
      <div class="timer-card">
        <PomHeader currentMode={currentMode()} />

        <div class="timer-display-container">
          <TimerDisplay minutes={minutes()} seconds={seconds()} />
          <ProgressBar 
            total={durations()[activeMode()]} 
            current={time()} 
            active={isRunning()}
          />
        </div>

        <div class="controls-grid">
          <For each={MODE_DEFINITIONS}>
            {(mode) => {
              const ModeIcon = mode.Icon;
              return (
                <TileButton
                  icon={<ModeIcon />}
                  label={mode.label}
                  intent={mode.id}
                  variant="mode"
                  active={activeMode() === mode.id}
                  onClick={() => setMode(mode.id)}
                />
              );
            }}
          </For>
          <TileButton
            icon={<Dynamic component={transportIcon()} />}
            label={pauseLabel()}
            intent="neutral"
            variant="action"
            onClick={togglePause}
          />
          <TileButton
            icon={<IconReset />}
            label="Reset"
            intent="neutral"
            variant="action"
            onClick={resetTimer}
          />
          <TileButton
            icon={<IconSettings />}
            label="Config"
            intent="neutral"
            variant="action"
            onClick={openConfig}
          />
        </div>
      </div>

      <Show when={isConfigOpen()}>
        <ConfigModal
          durations={durationsInMinutes()}
          onCancel={closeConfig}
          onSave={saveConfig}
        />
      </Show>
    </div>
  );
};

export default App;
