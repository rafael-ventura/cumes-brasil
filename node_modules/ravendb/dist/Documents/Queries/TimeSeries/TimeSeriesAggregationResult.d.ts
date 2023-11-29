import { TimeSeriesQueryResult } from "./TimeSeriesQueryResult";
import { TimeSeriesRangeAggregation } from "./TimeSeriesRangeAggregation";
import { EntityConstructor } from "../../../Types";
import { TypedTimeSeriesAggregationResult } from "./TypedTimeSeriesAggregationResult";
export declare class TimeSeriesAggregationResult extends TimeSeriesQueryResult {
    results: TimeSeriesRangeAggregation[];
    asTypedEntry<T extends object>(clazz: EntityConstructor<T>): TypedTimeSeriesAggregationResult<T>;
}
