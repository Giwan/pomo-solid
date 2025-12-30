import { createEffect, createMemo, createRoot, createSignal, onCleanup } from "solid-js";
import useTimer from "./useTimer";
import {
    loadFromStorage,
    removeFromStorage,
    saveToStorage,
} from "../utils/storage";
import {
    IconBreak,
    IconLongBreak,
    IconPause,
    IconPlay,
    IconWork,
} from "../components/icons";
import { playNotificationSound } from "../utils/audio";
import { Mode, ModeDurations, ModeMinutes, MODE_DEFINITIONS } from "../types";
import { updateAppBadge, vibrate } from "../utils/pwa";
import { isLockActive, releaseWakeLock, requestWakeLock } from "../utils/wakeLock";


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
const STORAGE_KEY = "pomodoro-durations";
const AUDIO_ENABLED_KEY = "pomodoro-audio-enabled";

interface PomodoroState {
    mode: Mode;
    isRunning: boolean;
    targetEndTime: number | null;
    remainingTime: number;
    lastUpdated: number;
}

const calculateInitialState = (
    savedState: PomodoroState | null,
    defaultDuration: number
): { initialTime: number; shouldAutoStart: boolean } => {
    if (!savedState) {
        return { initialTime: defaultDuration, shouldAutoStart: false };
    }

    if (savedState.isRunning && savedState.targetEndTime) {
        const remaining = Math.ceil((savedState.targetEndTime - Date.now()) / 1000);
        if (remaining > 0) {
            return { initialTime: remaining, shouldAutoStart: true };
        }
        return { initialTime: 0, shouldAutoStart: false };
    }

    return { initialTime: savedState.remainingTime, shouldAutoStart: false };
};

const sendNotification = (mode: Mode) => {
    if (!("Notification" in window) || Notification.permission !== "granted") return;

    vibrate([200, 100, 200, 100, 400]);

    new Notification("Pomodoro Timer", {
        body: `${mode === 'work' ? 'Work' : 'Break'} session finished!`,
        icon: "/pwa-192x192.png",
        vibrate: [200, 100, 200, 100, 400],
        tag: "pomodoro-alert"
    } as any);
};

const toSeconds = (minutes: ModeMinutes): ModeDurations => ({
    work: minutes.work * 60,
    break: minutes.break * 60,
    longBreak: minutes.longBreak * 60,
});

export default function usePomodoro() {
    const savedState = loadFromStorage<PomodoroState>(STATE_STORAGE_KEY);
    const initialMode = savedState?.mode || "work";
    const storedDurations = loadFromStorage<ModeDurations>(STORAGE_KEY) || DEFAULT_DURATIONS;
    const storedAudioEnabled = loadFromStorage<boolean>(AUDIO_ENABLED_KEY) ?? true;

    const [activeMode, setActiveMode] = createSignal<Mode>(initialMode);
    const [durations, setDurations] = createSignal<ModeDurations>(storedDurations);
    const [isAudioEnabled, setIsAudioEnabled] = createSignal(storedAudioEnabled);

    const [wakeLock, setWakeLock] = createSignal<any>(null);

    const acquireLock = async () => {
        if (isLockActive(wakeLock())) return;
        const lock = await requestWakeLock();
        setWakeLock(lock);
    };

    const releaseLock = async () => {
        const lock = wakeLock();
        if (lock) {
            await releaseWakeLock(lock);
            setWakeLock(null);
        }
    };

    const onTimerFinish = () => {
        if (isAudioEnabled()) {
            playNotificationSound();
        }
        sendNotification(activeMode());
        removeFromStorage(STATE_STORAGE_KEY);
        releaseLock();
        updateAppBadge(null);
    };

    const { initialTime, shouldAutoStart } = calculateInitialState(
        savedState,
        storedDurations[initialMode]
    );

    const [timerHandle, setTimerHandle] = createSignal<TimerHandle>(
        makeTimer(initialTime, onTimerFinish),
    );

    if (shouldAutoStart) {
        timerHandle().start();
        acquireLock();
    }
    const [isConfigOpen, setIsConfigOpen] = createSignal(false);

    onCleanup(() => timerHandle().dispose());

    const time = () => timerHandle().time();
    const minutes = createMemo(() => Math.floor(time() / 60));
    const seconds = createMemo(() => time() % 60);
    const isRunning = () => timerHandle().isActive();

    createEffect(() => {
        if (isRunning() && time() > 0) {
            updateAppBadge(Math.ceil(time() / 60));
        } else if (!isRunning() && time() === durations()[activeMode()]) {
            updateAppBadge(null);
        }
    });

    createEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === "visible" && isRunning()) {
                acquireLock();
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        onCleanup(() =>
            document.removeEventListener("visibilitychange", handleVisibility),
        );
    });

    const currentMode = createMemo(
        () =>
            MODE_DEFINITIONS.find((mode) => mode.id === activeMode()) ??
            MODE_DEFINITIONS[0],
    );

    const transportIcon = createMemo(() => (isRunning() ? IconPause : IconPlay));
    const isPristine = createMemo(() => time() === durations()[activeMode()]);
    const pauseLabel = createMemo(() => {
        if (isRunning()) return "Pause";
        return isPristine() ? "Start" : "Resume";
    });

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
        saveToStorage(STATE_STORAGE_KEY, state);
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
            acquireLock();
            return;
        }

        releaseLock();
        saveState(false, seconds);
        updateAppBadge(null);
    };

    const setMode = (mode: Mode) => {
        setActiveMode(mode);
        replaceTimer(durations()[mode], false);
    };

    const requestNotificationPermission = () => {
        if (!("Notification" in window) || Notification.permission !== "default") return;
        Notification.requestPermission();
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
            releaseLock();
            updateAppBadge(null);
            return;
        }

        timerHandle().start();
        saveState(true, time());
        acquireLock();
    };

    const resetTimer = () => {
        timerHandle().reset();
        saveState(false, durations()[activeMode()]);
        releaseLock();
        updateAppBadge(null);
    };

    const saveConfig = (minutesMap: ModeMinutes, audioEnabled: boolean) => {
        const nextDurations = toSeconds(minutesMap);
        saveToStorage(STORAGE_KEY, nextDurations);
        saveToStorage(AUDIO_ENABLED_KEY, audioEnabled);

        setDurations(nextDurations);
        setIsAudioEnabled(audioEnabled);
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
        isAudioEnabled,
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
