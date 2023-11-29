import { ClassConstructor } from "../../../Types";
import { TimeSeriesEntry } from "./TimeSeriesEntry";
export declare class TypedTimeSeriesRollupEntry<TValues extends object> {
    private _clazz;
    timestamp: Date;
    tag: string;
    rollup: boolean;
    private _first;
    private _last;
    private _max;
    private _min;
    private _sum;
    private _count;
    private _average;
    constructor(clazz: ClassConstructor<TValues>, timestamp: Date);
    private _createInstance;
    get max(): TValues;
    get min(): TValues;
    get count(): TValues;
    get first(): TValues;
    get last(): TValues;
    get sum(): TValues;
    get average(): TValues;
    getValuesFromMembers(): number[];
    private _assignRollup;
    static fromEntry<TValues extends object>(entry: TimeSeriesEntry, clazz: ClassConstructor<TValues>): TypedTimeSeriesRollupEntry<TValues>;
    private static _extractValues;
}
