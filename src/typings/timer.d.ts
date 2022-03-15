/* eslint-disable no-unused-vars */
export interface Time {
    ms: number;
    s: number;
    m: number;
    h: number;
    d: number;
}

export interface TimerOptions {
    label?: string;
    start_timestamp?: number;
    current_start_timestamp?: number;
    end_timestamp?: number;
    pause_count?: number;
    accumulated_ms?: number;
}

export class Timer {
    constructor(options?: TimerOptions);

    getLabel(): string;
    isStarted(): boolean;
    isPaused(): boolean;
    isRunning(): boolean;
    isStopped(): boolean;

    start(): Timer;
    pause(): Timer;
    resume(): Timer;
    stop(): Timer;

    time(): Time;
    pauseTime(): Time;

    ms(): number;
    pauseMs(): number;

    pauseCount(): number;

    format(template?: string): string;
    serialize(): string;
    clear(): Timer;

    static deserialize(serializedTimer: string): Timer;
    static benchmark(fn: () => any): Timer;

    private getTime(ms: number): Time;
}