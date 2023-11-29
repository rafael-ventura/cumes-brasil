import { TimeSeriesQueryResult } from "./TimeSeriesQueryResult";
import { TimeSeriesEntry } from "../../Session/TimeSeries/TimeSeriesEntry";
import { ClassConstructor } from "../../../Types";
import { TypedTimeSeriesRawResult } from "./TypedTimeSeriesRawResult";
export declare class TimeSeriesRawResult extends TimeSeriesQueryResult {
    results: TimeSeriesEntry[];
    asTypedResult<T extends object>(clazz: ClassConstructor<T>): TypedTimeSeriesRawResult<T>;
}
