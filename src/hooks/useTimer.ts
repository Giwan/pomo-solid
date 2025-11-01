import { createSignal, createEffect, onCleanup } from "solid-js";

const useTimer = (initialTime: number) => {
  const [time, setTime] = createSignal(initialTime);
  const [isActive, setIsActive] = createSignal(false);
  let interval: number;

  const start = () => {
    if (time() > 0) setIsActive(true);
  };

  const pause = () => setIsActive(false);

  const reset = () => {
    setIsActive(false);
    setTime(initialTime);
  };

  createEffect(() => {
    if (isActive() && time() > 0) {
      interval = setInterval(() => setTime((t) => t - 1), 1000);
    }

    if (time() === 0) setIsActive(false);

    onCleanup(() => clearInterval(interval));
  });

  return { time, isActive, start, pause, reset };
};

export default useTimer;
