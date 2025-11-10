import {
  Component,
  For,
  Show,
  createMemo,
  createRoot,
  createSignal,
  onCleanup,
} from "solid-js";
import TimerDisplay from "./components/TimerDisplay";
import TileButton from "./components/TileButton";
import ConfigModal from "./components/ConfigModal";
import useTimer from "./hooks/useTimer";
import {
  IconBreak,
  IconLongBreak,
  IconPause,
  IconPlay,
  IconReset,
  IconSettings,
  IconWork,
} from "./components/icons";
import "./App.css";

const MODE_DEFINITIONS = [
  { id: "work", label: "Work", Icon: IconWork },
  { id: "break", label: "Break", Icon: IconBreak },
  { id: "longBreak", label: "Long Break", Icon: IconLongBreak },
] as const;

type Mode = (typeof MODE_DEFINITIONS)[number]["id"];

type ModeDurations = Record<Mode, number>;
type ModeMinutes = Record<Mode, number>;

interface TimerHandle extends ReturnType<typeof useTimer> {
  dispose: () => void;
}

const DEFAULT_DURATIONS: ModeDurations = {
  work: 25 * 60,
  break: 5 * 60,
  longBreak: 15 * 60,
};

const makeTimer = (initialSeconds: number): TimerHandle => {
  let dispose!: () => void;
  const timer = createRoot((disposeFn) => {
    dispose = disposeFn;
    return useTimer(initialSeconds);
  });

  return { ...timer, dispose };
};

const App: Component = () => {
  const [activeMode, setActiveMode] = createSignal<Mode>("work");
  const [durations, setDurations] =
    createSignal<ModeDurations>(DEFAULT_DURATIONS);
  const [timerHandle, setTimerHandle] = createSignal<TimerHandle>(
    makeTimer(DEFAULT_DURATIONS.work),
  );
  const [isConfigOpen, setIsConfigOpen] = createSignal(false);

  onCleanup(() => timerHandle().dispose());

  const time = () => timerHandle().time();
  const minutes = createMemo(() => Math.floor(time() / 60));
  const seconds = createMemo(() => time() % 60);
  const isRunning = () => timerHandle().isActive();

  const currentMode = createMemo(
    () =>
      MODE_DEFINITIONS.find((mode) => mode.id === activeMode()) ??
      MODE_DEFINITIONS[0],
  );

  const transportIcon = createMemo(() => (isRunning() ? IconPause : IconPlay));
  const pauseLabel = createMemo(() => (isRunning() ? "Pause" : "Resume"));

  const durationsInMinutes = createMemo(() => ({
    work: Math.round(durations().work / 60),
    break: Math.round(durations().break / 60),
    longBreak: Math.round(durations().longBreak / 60),
  }));

  const replaceTimer = (seconds: number, autoStart = false) => {
    const previous = timerHandle();
    previous.pause();
    previous.dispose();

    const next = makeTimer(seconds);
    setTimerHandle(next);

    if (autoStart && seconds > 0) {
      queueMicrotask(() => next.start());
    }
  };

  const handleModeSelect = (mode: Mode) => {
    setActiveMode(mode);
    replaceTimer(durations()[mode], true);
  };

  const handlePauseToggle = () => {
    if (time() === 0) {
      replaceTimer(durations()[activeMode()], true);
      return;
    }

    if (isRunning()) {
      timerHandle().pause();
      return;
    }

    timerHandle().start();
  };

  const handleReset = () => {
    timerHandle().reset();
  };

  const handleConfigSave = (minutesMap: ModeMinutes) => {
    const nextDurations: ModeDurations = {
      work: minutesMap.work * 60,
      break: minutesMap.break * 60,
      longBreak: minutesMap.longBreak * 60,
    };

    setDurations(nextDurations);
    replaceTimer(nextDurations[activeMode()], false);
    setIsConfigOpen(false);
  };

  const handleConfigCancel = () => setIsConfigOpen(false);

  const handleConfigOpen = () => {
    timerHandle().pause();
    setIsConfigOpen(true);
  };

  return (
    <div class="app-shell">
      <div class="timer-card">
        {PomHeader(currentMode)}

        <TimerDisplay minutes={minutes()} seconds={seconds()} />
        <div class="tile-grid">
          <div class="tile-grid mode-grid">
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
                    onClick={() => handleModeSelect(mode.id)}
                  />
                );
              }}
            </For>
          </div>

          <div class="tile-grid action-grid">
            {(() => {
              const TransportIcon = transportIcon();
              return (
                <TileButton
                  icon={<TransportIcon />}
                  label={pauseLabel()}
                  intent="neutral"
                  variant="action"
                  onClick={handlePauseToggle}
                />
              );
            })()}
            <TileButton
              icon={<IconReset />}
              label="Reset"
              intent="neutral"
              variant="action"
              onClick={handleReset}
            />
            <TileButton
              icon={<IconSettings />}
              label="Config"
              intent="neutral"
              variant="action"
              onClick={handleConfigOpen}
            />
          </div>
        </div>
      </div>

      <Show when={isConfigOpen()}>
        <ConfigModal
          durations={durationsInMinutes()}
          onCancel={handleConfigCancel}
          onSave={handleConfigSave}
        />
      </Show>
    </div>
  );
};

export default App;

function PomHeader(currentMode: () => { id: Mode, label: string }) {
  return <header class="timer-header">
    <div class="header-titles">
      <span class="eyebrow">Focus Flow</span>
      <h1 class="header-title">Pomodoro</h1>
    </div>
    <div class="mode-chip" data-mode={currentMode().id}>
      <span class="chip-dot" aria-hidden="true" />
      <span>{currentMode().label}</span>
    </div>
  </header>;
}
