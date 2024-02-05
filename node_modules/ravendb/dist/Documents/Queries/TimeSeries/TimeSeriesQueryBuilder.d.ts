import { ITimeSeriesQueryBuilder } from "./ITimeSeriesQueryBuilder";
import { TimeSeriesQueryResult } from "./TimeSeriesQueryResult";
export declare class TimeSeriesQueryBuilder implements ITimeSeriesQueryBuilder {
    private _query;
    raw<T extends TimeSeriesQueryResult>(queryText: string): T;
    get queryText(): string;
}
