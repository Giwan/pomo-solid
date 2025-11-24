import { createSignal, createEffect, onCleanup, untrack } from "solid-js";

const useTimer = (initialTime: number, onFinish?: () => void) => {
  const [time, setTime] = createSignal(initialTime);
  const [isActive, setIsActive] = createSignal(false);
  let endTime = 0;

  const start = () => {
    const currentTime = untrack(time);
    if (currentTime <= 0) return;

    endTime = Date.now() + currentTime * 1000;
    setIsActive(true);
  };

  const pause = () => setIsActive(false);

  const reset = () => {
    setIsActive(false);
    setTime(initialTime);
  };

  createEffect(() => {
    if (!isActive()) return;

    const interval = setInterval(() => {
      const remaining = Math.ceil((endTime - Date.now()) / 1000);

      if (remaining <= 0) {
        setTime(0);
        setIsActive(false);
        if (onFinish) onFinish();
      } else setTime(remaining);
    }, 200);

    onCleanup(() => clearInterval(interval));
  });

  return { time, isActive, start, pause, reset };
};

export default useTimer;
