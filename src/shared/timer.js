/**
 * Class that represents a timer that can be used to measure time intervals,
 * in order to execute certain actions when a certain amount of time has passed.
 * 
 * For example, a timer can be used to automatically save the state of an application
 * after 60 seconds of inactivity. When the timer arrives to zero, the application
 * will save the state and timer will start again.
 */
export class Timer {
    /**
     * Creates a new timer.
     * 
     * @param {number} duration - The duration of the timer in milliseconds.
     * @param {function} callback - The callback function to execute when the timer reaches zero.
     */
    constructor(duration, callback) {
        this.duration = duration;
        this.callback = callback;
        this.timer = null;
    }

    /**
     * Starts the timer.
     */
    start() {
        this.stop();
        this.timer = setTimeout(() => {
            this.callback();
        }, this.duration);
    }

    /**
     * Stops the timer.
     */
    stop() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    /**
     * Resets the timer.
     */
    reset() {
        this.stop();
        this.start();
    }
}