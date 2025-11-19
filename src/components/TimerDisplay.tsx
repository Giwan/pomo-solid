import { Component } from "solid-js";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}

const TimerDisplay: Component<TimerDisplayProps> = (props) => {
  const format = (val: number) => val.toString().padStart(2, "0");

  return (
    <div class="timer-display">
      <span class="timer-value">{format(props.minutes)}</span>
      <span class="timer-separator">:</span>
      <span class="timer-value">{format(props.seconds)}</span>
    </div>
  );
};

export default TimerDisplay;
