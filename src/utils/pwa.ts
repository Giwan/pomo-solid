/**
 * PWA Browser API Utilities
 * Pure functions for interacting with device features.
 */

const getNavigator = () => (typeof navigator !== "undefined" ? navigator : null);

/**
 * Triggers a vibration pattern if supported.
 * @param pattern - Duration(s) in ms to vibrate.
 */
export const vibrate = (pattern: number | number[] = [200, 100, 200]) => {
    getNavigator()?.vibrate?.(pattern);
};

/**
 * Updates or clears the app icon badge.
 * @param count - The number to display, or null to clear.
 */
export const updateAppBadge = async (count: number | null) => {
    const nav = getNavigator() as any;
    if (!nav) return;

    try {
        if (count === null || count < 0) {
            await nav.clearAppBadge?.();
        } else {
            await nav.setAppBadge?.(count);
        }
    } catch (e) {
        // Fail silently to avoid interrupting the app flow
    }
};
