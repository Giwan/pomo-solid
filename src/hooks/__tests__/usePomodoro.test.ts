import { createRoot } from 'solid-js';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import usePomodoro from '../usePomodoro';
import * as storage from '../../utils/storage';
import * as audio from '../../utils/audio';

// Mock dependencies
vi.mock('../../utils/storage', () => ({
    loadFromStorage: vi.fn(),
    saveToStorage: vi.fn(),
    removeFromStorage: vi.fn(),
}));

vi.mock('../../utils/audio', () => ({
    playNotificationSound: vi.fn(),
}));

vi.mock('../../components/icons', () => ({
    IconBreak: () => 'IconBreak',
    IconLongBreak: () => 'IconLongBreak',
    IconPause: () => 'IconPause',
    IconPlay: () => 'IconPlay',
    IconWork: () => 'IconWork',
}));

// Mock Notification
class NotificationMock {
    static permission = 'granted';
    static requestPermission = vi.fn();
}
vi.stubGlobal('Notification', NotificationMock);

describe('usePomodoro', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mocks
        (storage.loadFromStorage as any).mockReturnValue(null);
    });

    afterEach(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    it('should initialize with audio enabled by default', () => {
        createRoot((dispose) => {
            const { isAudioEnabled } = usePomodoro();
            expect(isAudioEnabled()).toBe(true);
            dispose();
        });
    });

    it('should initialize with stored audio setting', () => {
        (storage.loadFromStorage as any).mockImplementation((key: string) => {
            if (key === 'pomodoro-audio-enabled') return false;
            return null;
        });

        createRoot((dispose) => {
            const { isAudioEnabled } = usePomodoro();
            expect(isAudioEnabled()).toBe(false);
            dispose();
        });
    });

    it('should update and persist audio setting when saving config', () => {
        createRoot((dispose) => {
            const { saveConfig, isAudioEnabled } = usePomodoro();

            const newDurations = { work: 25, break: 5, longBreak: 15 };
            saveConfig(newDurations, false);

            expect(isAudioEnabled()).toBe(false);
            expect(storage.saveToStorage).toHaveBeenCalledWith('pomodoro-audio-enabled', false);
            dispose();
        });
    });

    it('should play sound when timer finishes and audio is enabled', async () => {
        vi.useFakeTimers();

        let runTest: () => void;

        createRoot((dispose) => {
            const { togglePause, durations, activeMode, isRunning } = usePomodoro();

            // Start timer
            togglePause();
            // Verify timer started
            expect(isRunning()).toBe(true);

            runTest = () => {
                // Advance by duration + buffer
                const duration = durations()[activeMode()];
                const advanceAmount = (duration + 1) * 1000;
                vi.advanceTimersByTime(advanceAmount);

                expect(audio.playNotificationSound).toHaveBeenCalled();
                dispose();
            };
        });

        // Wait for effects to run
        await Promise.resolve();
        runTest!();
    });

    it('should NOT play sound when timer finishes and audio is disabled', async () => {
        vi.useFakeTimers();

        (storage.loadFromStorage as any).mockImplementation((key: string) => {
            if (key === 'pomodoro-audio-enabled') return false;
            return null;
        });

        let runTest: () => void;

        createRoot((dispose) => {
            const { togglePause, durations, activeMode, isAudioEnabled } = usePomodoro();

            expect(isAudioEnabled()).toBe(false);

            // Start timer
            togglePause();

            runTest = () => {
                // Advance time
                const duration = durations()[activeMode()];
                const advanceAmount = (duration + 1) * 1000;
                vi.advanceTimersByTime(advanceAmount);

                expect(audio.playNotificationSound).not.toHaveBeenCalled();
                dispose();
            };
        });

        await Promise.resolve();
        runTest!();
    });
});
