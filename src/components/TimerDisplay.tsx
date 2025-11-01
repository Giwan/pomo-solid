import { Component } from "solid-js";

interface TimerDisplayProps {
  minutes: number;
  seconds: number;
}

const formatTime = (time: number) => time.toString().padStart(2, "0");

const TimerDisplay: Component<TimerDisplayProps> = (props) => {
  return (
    <div class="screen">
      <span>{formatTime(props.minutes)}</span>:
      <span>{formatTime(props.seconds)}</span>
    </div>
  );
};

export default TimerDisplay;
