import { Component, createMemo } from "solid-js";
import TimerDisplay from "./components/TimerDisplay";
import Controls from "./components/Controls";
import useTimer from "./hooks/useTimer";
import "./App.css";

const App: Component = () => {
  const POMODORO_TIME = 25 * 60; // 25 minutes
  const { time, isActive, start, pause, reset } = useTimer(POMODORO_TIME);

  const minutes = createMemo(() => Math.floor(time() / 60));
  const seconds = createMemo(() => time() % 60);

  return (
    <div class="app-container">
      <div class="brand-header">
        <span class="brand-text">MODE</span>
        <h1>Pomodoro</h1>
        <span class="brand-text">FX</span>
      </div>
      <div class="screen">
        <TimerDisplay minutes={minutes()} seconds={seconds()} />
      </div>
      <Controls onStart={start} onPause={pause} onReset={reset} />
    </div>
  );
};

export default App;
