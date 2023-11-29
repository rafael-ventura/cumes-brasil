export declare class TypedTimeSeriesEntry<T extends object> {
    timestamp: Date;
    tag: string;
    values: number[];
    isRollup: boolean;
    value: T;
}
