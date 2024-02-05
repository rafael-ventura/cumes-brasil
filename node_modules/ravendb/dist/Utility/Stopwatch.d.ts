export declare class Stopwatch {
    private _startDate;
    private _endDate;
    start(): void;
    stop(): void;
    get elapsed(): number;
    static createStarted(): Stopwatch;
}
