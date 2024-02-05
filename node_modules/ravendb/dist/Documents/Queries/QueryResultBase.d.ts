import { QueryTimings } from "../Queries/Timings/QueryTimings";
export declare abstract class QueryResultBase<TResult, TInclude> {
    results: TResult;
    includes: TInclude;
    includedPaths: string[];
    isStale: boolean;
    indexTimestamp: Date;
    indexName: string;
    resultEtag: number;
    lastQueryTime: Date;
    counterIncludes: object;
    revisionIncludes: any[];
    includedCounterNames: {
        [key: string]: string[];
    };
    timeSeriesIncludes: any;
    compareExchangeValueIncludes: any;
    nodeTag: string;
    timings: QueryTimings;
}
