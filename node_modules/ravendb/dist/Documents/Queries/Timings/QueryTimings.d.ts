import { QueryResult } from "../QueryResult";
export declare class QueryTimings {
    durationInMs: number;
    timings: {
        [key: string]: QueryTimings;
    };
    update(queryResult: QueryResult): void;
}
