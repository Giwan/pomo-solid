import { Component, For, Show } from "solid-js";
import { Dynamic } from "solid-js/web";
import TimerDisplay from "./components/TimerDisplay";
import TileButton from "./components/TileButton";
import ConfigModal from "./components/ConfigModal";
import ProgressBar from "./components/ProgressBar";
import PomHeader from "./components/PomHeader";
import usePomodoro from "./hooks/usePomodoro";
import { MODE_DEFINITIONS, Mode } from "./types";
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
    isAudioEnabled,
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

        <TimerSection 
          minutes={minutes()}
          seconds={seconds()}
          total={durations()[activeMode()]}
          current={time()}
          active={isRunning()}
        />

        <ControlsSection 
          activeMode={activeMode()}
          setMode={setMode}
          transportIcon={transportIcon()}
          pauseLabel={pauseLabel()}
          togglePause={togglePause}
          resetTimer={resetTimer}
          openConfig={openConfig}
        />
      </div>

      <Show when={isConfigOpen()}>
        <ConfigModal
          durations={durationsInMinutes()}
          audioEnabled={isAudioEnabled()}
          onCancel={closeConfig}
          onSave={saveConfig}
        />
      </Show>
    </div>
  );
};

export default App;

interface TimerSectionProps {
  minutes: number;
  seconds: number;
  total: number;
  current: number;
  active: boolean;
}

const TimerSection: Component<TimerSectionProps> = (props) => {
  return (
    <div class="timer-display-container">
      <ProgressBar 
        total={props.total} 
        current={props.current} 
        active={props.active}
      />
      <TimerDisplay minutes={props.minutes} seconds={props.seconds} />
    </div>
  );
};

interface ControlsSectionProps {
  activeMode: Mode;
  setMode: (mode: Mode) => void;
  transportIcon: Component;
  pauseLabel: string;
  togglePause: () => void;
  resetTimer: () => void;
  openConfig: () => void;
}

const ControlsSection: Component<ControlsSectionProps> = (props) => {
  return (
    <div class="controls-grid">
      <For each={MODE_DEFINITIONS}>
        {(mode) => (
          <ModeControl 
            mode={mode} 
            activeMode={props.activeMode} 
            setMode={props.setMode} 
          />
        )}
      </For>
      <TileButton
        icon={<Dynamic component={props.transportIcon} />}
        label={props.pauseLabel}
        intent="neutral"
        variant="action"
        onClick={props.togglePause}
      />
      <TileButton
        icon={<IconReset />}
        label="Reset"
        intent="neutral"
        variant="action"
        onClick={props.resetTimer}
      />
      <TileButton
        icon={<IconSettings />}
        label="Config"
        intent="neutral"
        variant="action"
        onClick={props.openConfig}
      />
    </div>
  );
};

interface ModeControlProps {
  mode: typeof MODE_DEFINITIONS[number];
  activeMode: Mode;
  setMode: (mode: Mode) => void;
}

const ModeControl: Component<ModeControlProps> = (props) => {
  const ModeIcon = props.mode.Icon;
  return (
    <TileButton
      icon={<ModeIcon />}
      label={props.mode.label}
      intent={props.mode.id}
      variant="mode"
      active={props.activeMode === props.mode.id}
      onClick={() => props.setMode(props.mode.id)}
    />
  );
};
