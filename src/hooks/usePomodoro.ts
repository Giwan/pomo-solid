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

const makeTimer = (initialSeconds: number, onFinish?: () => void): TimerHandle => {
    let dispose!: () => void;
    const timer = createRoot((disposeFn) => {
        dispose = disposeFn;
        return useTimer(initialSeconds, onFinish);
    });

    return { ...timer, dispose };
};

const STATE_STORAGE_KEY = "pomodoro-state";

interface PomodoroState {
    mode: Mode;
    isRunning: boolean;
    targetEndTime: number | null;
    remainingTime: number;
    lastUpdated: number;
}

const loadState = (): PomodoroState | null => {
    try {
        const stored = localStorage.getItem(STATE_STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.warn("Failed to load state", e);
    }
    return null;
};

const STORAGE_KEY = "pomodoro-durations";

const getStoredDurations = (): ModeDurations => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn("Failed to load durations from localStorage", e);
    }
    return DEFAULT_DURATIONS;
};

export default function usePomodoro() {
    const savedState = loadState();
    const initialMode = savedState?.mode || "work";

    const [activeMode, setActiveMode] = createSignal<Mode>(initialMode);
    const [durations, setDurations] =
        createSignal<ModeDurations>(getStoredDurations());

    const onTimerFinish = () => {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Pomodoro Timer", {
                body: `${activeMode() === 'work' ? 'Work' : 'Break'} session finished!`,
                icon: "/pwa-192x192.png"
            });
        }
        localStorage.removeItem(STATE_STORAGE_KEY);
    };

    let initialTime = getStoredDurations()[initialMode];
    let shouldAutoStart = false;

    if (savedState) {
        if (savedState.isRunning && savedState.targetEndTime) {
            const remaining = Math.ceil((savedState.targetEndTime - Date.now()) / 1000);
            if (remaining > 0) {
                initialTime = remaining;
                shouldAutoStart = true;
            } else {
                initialTime = 0;
            }
        } else {
            initialTime = savedState.remainingTime;
        }
    }

    const [timerHandle, setTimerHandle] = createSignal<TimerHandle>(
        makeTimer(initialTime, onTimerFinish),
    );

    if (shouldAutoStart) {
        timerHandle().start();
    }
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

    const saveState = (running: boolean, remaining: number) => {
        const state: PomodoroState = {
            mode: activeMode(),
            isRunning: running,
            targetEndTime: running ? Date.now() + remaining * 1000 : null,
            remainingTime: remaining,
            lastUpdated: Date.now(),
        };
        localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
    };

    const replaceTimer = (seconds: number, autoStart = false) => {
        const previous = timerHandle();
        previous.pause();
        previous.dispose();

        const next = makeTimer(seconds, onTimerFinish);
        setTimerHandle(next);

        if (autoStart && seconds > 0) {
            queueMicrotask(() => next.start());
            saveState(true, seconds);
        } else {
            saveState(false, seconds);
        }
    };

    const setMode = (mode: Mode) => {
        setActiveMode(mode);
        replaceTimer(durations()[mode], true);
    };

    const requestNotificationPermission = () => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    };

    const togglePause = () => {
        requestNotificationPermission();

        if (time() === 0) {
            replaceTimer(durations()[activeMode()], true);
            return;
        }

        if (isRunning()) {
            timerHandle().pause();
            saveState(false, time());
            return;
        }

        timerHandle().start();
        saveState(true, time());
    };

    const resetTimer = () => {
        timerHandle().reset();
        saveState(false, durations()[activeMode()]);
    };

    const saveConfig = (minutesMap: ModeMinutes) => {
        const nextDurations: ModeDurations = {
            work: minutesMap.work * 60,
            break: minutesMap.break * 60,
            longBreak: minutesMap.longBreak * 60,
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDurations));
        } catch (e) {
            console.warn("Failed to save durations to localStorage", e);
        }

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
