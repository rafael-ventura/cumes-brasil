import { AbstractDocumentQuery } from "./AbstractDocumentQuery";
import { IRawDocumentQuery } from "../Session/IRawDocumentQuery";
import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
import { DocumentType } from "../DocumentAbstractions";
import { QueryOperator } from "../Queries/QueryOperator";
import { QueryStatistics } from "./QueryStatistics";
import { QueryTimings } from "../Queries/Timings/QueryTimings";
import { ValueCallback } from "../../Types/Callbacks";
import { FacetResult } from "../Queries/Facets";
import { ProjectionBehavior } from "../Queries/ProjectionBehavior";
export declare class RawDocumentQuery<T extends object> extends AbstractDocumentQuery<T, RawDocumentQuery<T>> implements IRawDocumentQuery<T> {
    constructor(session: InMemoryDocumentSessionOperations, rawQuery: string, clazz?: DocumentType<T>);
    skip(count: number): IRawDocumentQuery<T>;
    take(count: number): IRawDocumentQuery<T>;
    waitForNonStaleResults(): IRawDocumentQuery<T>;
    waitForNonStaleResults(waitTimeout?: number): IRawDocumentQuery<T>;
    timings(timings: ValueCallback<QueryTimings>): IRawDocumentQuery<T>;
    noTracking(): IRawDocumentQuery<T>;
    noCaching(): IRawDocumentQuery<T>;
    usingDefaultOperator(queryOperator: QueryOperator): IRawDocumentQuery<T>;
    statistics(statsCallback: (stats: QueryStatistics) => void): IRawDocumentQuery<T>;
    addParameter(name: string, value: any): IRawDocumentQuery<T>;
    executeAggregation(): Promise<Record<string, FacetResult>>;
    projection(projectionBehavior: ProjectionBehavior): IRawDocumentQuery<T>;
}
