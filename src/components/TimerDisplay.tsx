import { Component } from "solid-js";
import { formatTimeSegment } from "../utils/formatting";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}

const TimerDisplay: Component<TimerDisplayProps> = (props) => {
  return (
    <div class="timer-display">
      <span class="timer-value">{formatTimeSegment(props.minutes)}</span>
      <span class="timer-separator">:</span>
      <span class="timer-value">{formatTimeSegment(props.seconds)}</span>
    </div>
  );
};

export default TimerDisplay;
