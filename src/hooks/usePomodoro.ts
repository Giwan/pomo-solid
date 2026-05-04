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
import { flashScreen, updateAppBadge, vibrate } from "../utils/pwa";
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
const FLASH_WARNING_KEY = "pomodoro-flash-warning";

const DEFAULT_FLASH_WARNING = 5;

interface PersistedConfig {
    durations: ModeDurations;
    audioEnabled: boolean;
    flashWarningSeconds: number;
}

const loadPersistedConfig = (): PersistedConfig => ({
    durations: loadFromStorage<ModeDurations>(STORAGE_KEY) || DEFAULT_DURATIONS,
    audioEnabled: loadFromStorage<boolean>(AUDIO_ENABLED_KEY) ?? true,
    flashWarningSeconds: loadFromStorage<number>(FLASH_WARNING_KEY) ?? DEFAULT_FLASH_WARNING,
});

const savePersistedConfig = (
    durations: ModeDurations,
    audioEnabled: boolean,
    flashWarning: number
) => {
    saveToStorage(STORAGE_KEY, durations);
    saveToStorage(AUDIO_ENABLED_KEY, audioEnabled);
    saveToStorage(FLASH_WARNING_KEY, flashWarning);
};

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

const createWakeLockManager = () => {
    const [lock, setLock] = createSignal<any>(null);

    const acquire = async () => {
        if (isLockActive(lock())) return;
        const newLock = await requestWakeLock();
        setLock(newLock);
    };

    const release = async () => {
        const current = lock();
        if (current) {
            await releaseWakeLock(current);
            setLock(null);
        }
    };

    return { lock, acquire, release };
};

const toSeconds = (minutes: ModeMinutes): ModeDurations => ({
    work: minutes.work * 60,
    break: minutes.break * 60,
    longBreak: minutes.longBreak * 60,
});

const getModeDefinition = (mode: Mode) =>
    MODE_DEFINITIONS.find((m) => m.id === mode) ?? MODE_DEFINITIONS[0];

const createFlashOnLowTime = (
    time: () => number,
    isRunning: () => boolean,
    flashThreshold: () => number
) => {
    let lastFlashedSecond = -1;
    createEffect(() => {
        const t = time();
        const threshold = flashThreshold();
        if (isRunning() && t > 0 && t <= threshold && t !== lastFlashedSecond) {
            lastFlashedSecond = t;
            flashScreen();
        }
        if (t > threshold) {
            lastFlashedSecond = -1;
        }
    });
};

export default function usePomodoro() {
    const savedState = loadFromStorage<PomodoroState>(STATE_STORAGE_KEY);
    const config = loadPersistedConfig();
    const initialMode = savedState?.mode || "work";

    const [activeMode, setActiveMode] = createSignal<Mode>(initialMode);
    const [durations, setDurations] = createSignal<ModeDurations>(config.durations);
    const [isAudioEnabled, setIsAudioEnabled] = createSignal(config.audioEnabled);
    const [flashWarningSeconds, setFlashWarningSeconds] = createSignal(config.flashWarningSeconds);

    const wakeLock = createWakeLockManager();

    const onTimerFinish = () => {
        if (isAudioEnabled()) playNotificationSound();
        sendNotification(activeMode());
        removeFromStorage(STATE_STORAGE_KEY);
        wakeLock.release();
        updateAppBadge(null);
    };

    const { initialTime, shouldAutoStart } = calculateInitialState(
        savedState,
        config.durations[initialMode]
    );

    const [timerHandle, setTimerHandle] = createSignal<TimerHandle>(
        makeTimer(initialTime, onTimerFinish),
    );

    if (shouldAutoStart) {
        timerHandle().start();
        wakeLock.acquire();
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
                wakeLock.acquire();
            }
        };
        document.addEventListener("visibilitychange", handleVisibility);
        onCleanup(() =>
            document.removeEventListener("visibilitychange", handleVisibility),
        );
    });

    createFlashOnLowTime(time, isRunning, flashWarningSeconds);

    const currentMode = createMemo(() => getModeDefinition(activeMode()));

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
            wakeLock.acquire();
            return;
        }

        wakeLock.release();
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
            wakeLock.release();
            updateAppBadge(null);
            return;
        }

        timerHandle().start();
        saveState(true, time());
        wakeLock.acquire();
    };

    const resetTimer = () => {
        timerHandle().reset();
        saveState(false, durations()[activeMode()]);
        wakeLock.release();
        updateAppBadge(null);
    };

    const saveConfig = (minutesMap: ModeMinutes, audioEnabled: boolean, flashWarning: number) => {
        const nextDurations = toSeconds(minutesMap);
        savePersistedConfig(nextDurations, audioEnabled, flashWarning);

        setDurations(nextDurations);
        setIsAudioEnabled(audioEnabled);
        setFlashWarningSeconds(flashWarning);
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
        flashWarningSeconds,
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
