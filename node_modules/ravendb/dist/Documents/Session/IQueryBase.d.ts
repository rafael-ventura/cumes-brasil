import { QueryOperator } from "../Queries/QueryOperator";
import { IndexQuery } from "../Queries/IndexQuery";
import { QueryStatistics } from "./QueryStatistics";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { QueryEventsEmitter } from "../Session/QueryEvents";
import { ValueCallback } from "../../Types/Callbacks";
import { QueryTimings } from "../Queries/Timings/QueryTimings";
export interface IQueryBase<T, TSelf extends IQueryBase<T, TSelf>> extends QueryEventsEmitter {
    conventions: DocumentConventions;
    noCaching(): TSelf;
    noTracking(): TSelf;
    timings(timings: ValueCallback<QueryTimings>): TSelf;
    skip(count: number): TSelf;
    statistics(statsCallback: (stats: QueryStatistics) => void): TSelf;
    take(count: number): TSelf;
    usingDefaultOperator(queryOperator: QueryOperator): TSelf;
    waitForNonStaleResults(): TSelf;
    waitForNonStaleResults(waitTimeout: number): TSelf;
    getIndexQuery(): IndexQuery;
    addParameter(name: string, value: any): TSelf;
}
