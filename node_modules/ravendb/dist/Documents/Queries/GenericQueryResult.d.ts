import { QueryResultBase } from "./QueryResultBase";
export interface QueryResultHighlightings {
    [key: string]: {
        [key: string]: string[];
    };
}
export interface QueryResultExplanations {
    [key: string]: string[];
}
export declare class GenericQueryResult<TResult, TIncludes> extends QueryResultBase<TResult, TIncludes> {
    totalResults: number;
    longTotalResults: number;
    cappedMaxResults: number;
    skippedResults: number;
    highlightings: QueryResultHighlightings;
    explanations: QueryResultExplanations;
    durationInMs: number;
    scoreExplanations: {
        [key: string]: string;
    };
    timingsInMs: {
        [key: string]: number;
    };
    resultSize: number;
    timeSeriesFields: string[];
}
