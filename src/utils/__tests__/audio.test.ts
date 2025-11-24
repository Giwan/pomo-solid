import { describe, it, expect, vi, afterEach } from 'vitest';
import { playNotificationSound } from '../audio';

describe('playNotificationSound', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should create an oscillator and play sound when AudioContext is available', () => {
        const mockOscillator = {
            connect: vi.fn(),
            start: vi.fn(),
            stop: vi.fn(),
            type: '',
            frequency: {
                setValueAtTime: vi.fn(),
                exponentialRampToValueAtTime: vi.fn(),
            },
        };

        const mockGain = {
            connect: vi.fn(),
            gain: {
                setValueAtTime: vi.fn(),
                exponentialRampToValueAtTime: vi.fn(),
            },
        };

        const mockContext = {
            createOscillator: vi.fn(() => mockOscillator),
            createGain: vi.fn(() => mockGain),
            currentTime: 0,
            destination: {},
        };

        const AudioContextMock = vi.fn(function () {
            return mockContext;
        });
        vi.stubGlobal('AudioContext', AudioContextMock);

        playNotificationSound();

        expect(AudioContextMock).toHaveBeenCalled();
        expect(mockContext.createOscillator).toHaveBeenCalled();
        expect(mockContext.createGain).toHaveBeenCalled();
        expect(mockOscillator.connect).toHaveBeenCalledWith(mockGain);
        expect(mockGain.connect).toHaveBeenCalledWith(mockContext.destination);
        expect(mockOscillator.start).toHaveBeenCalled();
        expect(mockOscillator.stop).toHaveBeenCalled();
    });

    it('should gracefully handle missing AudioContext', () => {
        vi.stubGlobal('AudioContext', undefined);
        vi.stubGlobal('webkitAudioContext', undefined);

        expect(() => playNotificationSound()).not.toThrow();
    });
});
