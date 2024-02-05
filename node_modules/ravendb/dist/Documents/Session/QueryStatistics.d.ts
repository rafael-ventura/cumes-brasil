import { QueryResult } from "../Queries/QueryResult";
export declare class QueryStatistics {
    isStale: boolean;
    durationInMs: number;
    totalResults: number;
    longTotalResults: number;
    skippedResults: number;
    timestamp: Date;
    indexName: string;
    indexTimestamp: Date;
    lastQueryTime: Date;
    resultEtag: number;
    nodeTag: string;
    updateQueryStats(qr: QueryResult): void;
}
