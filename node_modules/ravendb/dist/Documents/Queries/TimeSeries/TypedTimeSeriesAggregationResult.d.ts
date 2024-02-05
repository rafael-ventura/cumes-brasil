import { TimeSeriesQueryResult } from "./TimeSeriesQueryResult";
import { TypedTimeSeriesRangeAggregation } from "./TypedTimeSeriesRangeAggregation";
export declare class TypedTimeSeriesAggregationResult<T extends object> extends TimeSeriesQueryResult {
    results: TypedTimeSeriesRangeAggregation<T>[];
}
