/**
 * System utility for handling haptic feedback (vibrations) on mobile devices.
 * Implements various interaction patterns using the Web Vibration API.
 */

export const isVibrationSupported = () => {
    return typeof window !== 'undefined' && 'vibrate' in navigator;
};

export const haptics = {
    /**
     * Minor actions (selecting items, toggles, small UI changes)
     */
    light: () => {
        if (isVibrationSupported()) navigator.vibrate(10);
    },

    /**
     * Standard actions (button clicks, opening/closing bottom sheets, navigation)
     */
    medium: () => {
        if (isVibrationSupported()) navigator.vibrate(20);
    },

    /**
     * Important or physical interactions (long press, drag handle, major primary buttons)
     */
    heavy: () => {
        if (isVibrationSupported()) navigator.vibrate(40);
    },

    /**
     * Successful completion of a task (save, create, sync complete)
     * Pattern: Two distinct positive pulses
     */
    success: () => {
        if (isVibrationSupported()) navigator.vibrate([15, 100, 20]);
    },

    /**
     * Warning or destructive actions (intent to delete, warning modal)
     * Pattern: One longer pulse followed by a short pulse
     */
    warning: () => {
        if (isVibrationSupported()) navigator.vibrate([30, 80, 20]);
    },

    /**
     * Errors (validation failure, action failed)
     * Pattern: Three distinct rapid pulses
     */
    error: () => {
        if (isVibrationSupported()) navigator.vibrate([40, 60, 40, 60, 40]);
    }
};
