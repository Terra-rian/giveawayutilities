import { Time, TimerOptions } from '../typings/timer';

export class Timer {
    label: string;
    start_timestamp: number | undefined;
    current_start_timestamp: number | undefined;
    end_timestamp: number | undefined;
    pause_count: number;
    accumulated_ms: number;

    /**
     * Creates a new timer.
     */
    constructor(options: TimerOptions = {}) {
        const { label, start_timestamp, end_timestamp, current_start_timestamp, pause_count, accumulated_ms } = options;

        const timer_start_timestamp = (start_timestamp && start_timestamp >= 0 && start_timestamp < Date.now()) ? start_timestamp : undefined;
        const timer_end_timestamp = (timer_start_timestamp && timer_start_timestamp >= 0 && end_timestamp && end_timestamp > 0 && end_timestamp > timer_start_timestamp) ? end_timestamp : undefined;
        const timer_current_timestamp = (current_start_timestamp && timer_start_timestamp && current_start_timestamp >= timer_start_timestamp && (!timer_end_timestamp || current_start_timestamp < timer_end_timestamp)) ? current_start_timestamp : timer_start_timestamp;

        this.label = label || '';
        this.start_timestamp = timer_start_timestamp;
        this.current_start_timestamp = timer_current_timestamp;
        this.end_timestamp = timer_end_timestamp;
        this.pause_count = pause_count || 0;
        this.accumulated_ms = accumulated_ms || 0;
    }

    getLabel(): string {
        return this.label;
    }

    isStarted(): boolean {
        return this.start_timestamp ? this.start_timestamp >= 0 : false;
    }

    isPaused(): boolean {
        return this.isStarted() && this.current_start_timestamp === undefined;
    }

    isRunning(): boolean {
        return this.isStarted() && !this.isPaused() && !this.isStopped();
    }

    isStopped(): boolean {
        return this.end_timestamp ? this.end_timestamp > 0 : false;
    }

    /**
     * Starts the timer.
     */
    start(): Timer {
        if(this.isStarted() && !this.isStopped()) {
            return this;
        }

        this.clear();

        this.start_timestamp = Date.now();
        this.current_start_timestamp = this.start_timestamp;

        return this;
    }

    /**
     * Pauses the timer.
     */
    pause(): Timer {
        if(this.isPaused() || !this.isStarted() || this.isStopped()) {
            return this;
        }

        this.pause_count += 1;
        this.accumulated_ms += Date.now() - (this.current_start_timestamp as number);
        this.current_start_timestamp = undefined;

        return this;
    }

    /**
     * Resumes the paused timer.
     */
    resume(): Timer {
        if(!this.isPaused() || this.isStopped()) {
            return this;
        }

        this.current_start_timestamp = Date.now();
        return this;
    }

    /**
     * Stops the started timer.
     */
    stop(): Timer {
        if(!this.isStarted()) {
            return this;
        }

        this.end_timestamp = Date.now();
        return this;
    }

    /**
     * Returns the elapsed time as an object of time fractions.
     */
    time(): Time {
        return this.getTime(this.ms());
    }

    /**
     * Returns the paused time as an object of time fractions.
     */
    pauseTime(): Time {
        return this.getTime(this.pauseMs());
    }

    /**
     * Returns the elapsed running time in milliseconds.
     */
    ms(): number {
        if(!this.isStarted()) {
            return 0;
        }

        if(this.isPaused()) {
            return this.accumulated_ms;
        }

        const end_timestamp = this.end_timestamp || Date.now();
        const current_milliseconds = end_timestamp - (this.current_start_timestamp as number);

        return current_milliseconds + this.accumulated_ms;
    }

    /**
     * Returns the elapsed pause time in milliseconds.
     */
    pauseMs(): number {
        if(!this.isStarted()) {
            return 0;
        }

        const end_timestamp = this.end_timestamp || Date.now();
        return (end_timestamp - (this.start_timestamp as number)) - this.ms();
    }

    /**
     * Returns the number of pauses.
     */
    pauseCount(): number {
        return this.pause_count;
    }

    /**
     * Formats the recorded time using a template.
     */
    format(template: string = '%label%d d, %h h, %m m, %s s, %ms ms'): string {
        const time = this.time();

        return template.replace('%label', this.label ? `${this.label}: ` : '').replace('%ms', time.ms.toString()).replace('%s', time.s.toString()).replace('%m', time.m.toString()).replace('%h', time.h.toString()).replace('%d', time.d.toString());
    }

    /**
     * Serializes the timer.
     */
    serialize(): string {
        return JSON.stringify({
            start_timestamp: this.start_timestamp,
            current_start_timestamp: this.current_start_timestamp,
            end_timestamp: this.end_timestamp,
            accumulated_ms: this.accumulated_ms,
            pause_count: this.pause_count,
            label: this.label,
        });
    }

    /**
     * Clears the timer.
     */
    clear(): Timer {
        this.start_timestamp = undefined;
        this.current_start_timestamp = undefined;
        this.end_timestamp = undefined;
        this.accumulated_ms = 0;
        this.pause_count = 0;

        return this;
    }

    /**
     * Deserializes the timer.
     */
    static deserialize(serializedTime: string): Timer {
        return new Timer(JSON.parse(serializedTime));
    }

    /**
     * Creates a benchmark timer for a function.
     */
    static benchmark(fn: Function): Timer {
        const timer = new Timer({ label: fn.name }).start();
        fn();

        return timer.stop();
    }

    private getTime(ms: number): Time {
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        const h = Math.floor(m / 60);
        const d = Math.floor(h / 24);

        return {
            ms: ms % 1000,
            s: s % 60,
            m: m % 60,
            h: h % 24,
            d,
        };
    }
}