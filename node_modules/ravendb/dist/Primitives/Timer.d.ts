import { IDisposable } from "../Types/Contracts";
export declare class Timer implements IDisposable {
    private _action;
    private _scheduledActionPromise;
    private _firstTimeDelayId;
    private _intervalId;
    private _intervalTimerId;
    private _periodInMs;
    constructor(action: () => Promise<any>, dueTimeInMs: number, periodInMs?: number);
    change(dueTimeInMs: number, period?: number): void;
    private _schedule;
    private _timerAction;
    private _clearTimers;
    dispose(): void;
}
