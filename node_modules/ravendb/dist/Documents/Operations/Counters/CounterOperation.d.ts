import { CounterOperationType } from "./CounterOperationType";
export declare class CounterOperation {
    private _type;
    private _counterName;
    private _delta;
    protected _changeVector: string;
    serialize(): object;
    get type(): CounterOperationType;
    set type(value: CounterOperationType);
    get counterName(): string;
    set counterName(value: string);
    get delta(): number;
    set delta(value: number);
    get changeVector(): string;
    set changeVector(changeVector: string);
    static create(counterName: string, type: CounterOperationType): CounterOperation;
    static create(counterName: string, type: CounterOperationType, delta: number): CounterOperation;
}
