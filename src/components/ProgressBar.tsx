import { Component, createMemo } from "solid-js";

interface ProgressBarProps {
  totalSeconds: number;
  currentSeconds: number;
  isActive: boolean;
}

const ProgressBar: Component<ProgressBarProps> = (props) => {
  const progress = createMemo(() => {
    if (props.totalSeconds === 0) return 0;
    return ((props.totalSeconds - props.currentSeconds) / props.totalSeconds) * 100;
  });

  return (
    <div class="progress-bar-container">
      <div
        class="progress-bar-fill"
        style={{ width: `${progress()}%` }}
      />
    </div>
  );
};

export default ProgressBar;
