export declare class HiloRangeValue {
    private readonly _minId;
    private readonly _maxId;
    private _current;
    constructor(minId?: number, maxId?: number);
    get minId(): number;
    get maxId(): number;
    get current(): number;
    increment(): number;
}
