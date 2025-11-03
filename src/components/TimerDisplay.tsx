import { Component } from "solid-js";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}

const formatTime = (time: number) => time.toString().padStart(2, "0");

const TimerDisplay: Component<TimerDisplayProps> = (props) => {
  return (
    <div class="timer-display" aria-live="polite" aria-atomic="true">
      <span class="timer-value">{formatTime(props.minutes)}</span>
      <span class="timer-separator">:</span>
      <span class="timer-value">{formatTime(props.seconds)}</span>
    </div>
  );
};

export default TimerDisplay;
