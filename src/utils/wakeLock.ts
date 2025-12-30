/**
 * Screen Wake Lock API Utilities
 * Pure functions to manage device sleep prevention.
 */

/**
 * Checks if a wake lock sentinel is active and not released.
 * @param sentinel - The sentinel to check.
 */
export const isLockActive = (sentinel: any): boolean => {
    return sentinel !== null && typeof sentinel === "object" && !sentinel.released;
};

/**
 * Requests a screen wake lock.
 * @returns A Promise that resolves to a WakeLockSentinel or null if unsupported/failed.
 */
export const requestWakeLock = async () => {
    if (typeof navigator === "undefined" || !("wakeLock" in navigator)) {
        return null;
    }

    try {
        return await (navigator as any).wakeLock.request("screen");
    } catch {
        return null;
    }
};

/**
 * Releases a wake lock sentinel.
 * @param sentinel - The sentinel to release.
 */
export const releaseWakeLock = async (sentinel: any) => {
    if (isLockActive(sentinel)) {
        try {
            await sentinel.release();
        } catch {
            // Ignore release errors
        }
    }
};
