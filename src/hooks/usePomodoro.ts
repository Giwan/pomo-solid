import { createMemo, createRoot, createSignal, onCleanup } from "solid-js";
import useTimer from "./useTimer";
import {
    IconBreak,
    IconLongBreak,
    IconPause,
    IconPlay,
    IconWork,
} from "../components/icons";
import { Mode, ModeDurations, ModeMinutes, MODE_DEFINITIONS } from "../types";


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

export default function usePomodoro() {
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

    const setMode = (mode: Mode) => {
        setActiveMode(mode);
        replaceTimer(durations()[mode], true);
    };

    const togglePause = () => {
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

    const resetTimer = () => {
        timerHandle().reset();
    };

    const saveConfig = (minutesMap: ModeMinutes) => {
        const nextDurations: ModeDurations = {
            work: minutesMap.work * 60,
            break: minutesMap.break * 60,
            longBreak: minutesMap.longBreak * 60,
        };

        setDurations(nextDurations);
        replaceTimer(nextDurations[activeMode()], false);
        setIsConfigOpen(false);
    };

    const closeConfig = () => setIsConfigOpen(false);

    const openConfig = () => {
        timerHandle().pause();
        setIsConfigOpen(true);
    };

    return {
        activeMode,
        durations,
        isConfigOpen,
        minutes,
        seconds,
        isRunning,
        currentMode,
        transportIcon,
        pauseLabel,
        durationsInMinutes,
        setMode,
        togglePause,
        resetTimer,
        saveConfig,
        closeConfig,
        openConfig,
        time,
    };
}
