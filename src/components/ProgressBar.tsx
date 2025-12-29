import { Component, createMemo } from "solid-js";

interface ProgressBarProps {
  total: number;
  current: number;
  active: boolean;
}

const ProgressBar: Component<ProgressBarProps> = (props) => {
  const percentage = createMemo(() => {
    if (props.total === 0) return 0;
    return ((props.total - props.current) / props.total) * 100;
  });

  return (
    <div class="progress-container">
      <div 
        class="progress-bar" 
        style={{ width: `${percentage()}%` }}
        classList={{ "active": props.active }}
      />
    </div>
  );
};

export default ProgressBar;
