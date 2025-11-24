import { describe, it, expect } from 'vitest';
import { formatTimeSegment } from '../formatting';

describe('formatTimeSegment', () => {
    it('pads single digit numbers with a leading zero', () => {
        expect(formatTimeSegment(5)).toBe('05');
        expect(formatTimeSegment(0)).toBe('00');
        expect(formatTimeSegment(9)).toBe('09');
    });

    it('does not pad double digit numbers', () => {
        expect(formatTimeSegment(10)).toBe('10');
        expect(formatTimeSegment(59)).toBe('59');
    });

    it('handles numbers larger than 2 digits (though unlikely for time segments)', () => {
        expect(formatTimeSegment(100)).toBe('100');
    });
});
