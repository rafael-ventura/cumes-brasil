import { TimeSeriesQueryResult } from "./TimeSeriesQueryResult";
import { TypedTimeSeriesEntry } from "../../Session/TimeSeries/TypedTimeSeriesEntry";
export declare class TypedTimeSeriesRawResult<TValues extends object> extends TimeSeriesQueryResult {
    results: TypedTimeSeriesEntry<TValues>[];
}
