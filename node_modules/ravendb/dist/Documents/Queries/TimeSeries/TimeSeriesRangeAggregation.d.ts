import { ClassConstructor } from "../../../Types";
import { TypedTimeSeriesRangeAggregation } from "./TypedTimeSeriesRangeAggregation";
export declare class TimeSeriesRangeAggregation {
    count: number[];
    max: number[];
    min: number[];
    last: number[];
    first: number[];
    average: number[];
    sum: number[];
    to: Date;
    from: Date;
    asTypedEntry<T extends object>(clazz: ClassConstructor<T>): TypedTimeSeriesRangeAggregation<T>;
}
