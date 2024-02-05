import { AbstractDocumentQuery } from "./AbstractDocumentQuery";
import { IGraphDocumentQuery } from "./IGraphDocumentQuery";
import { DocumentType } from "../DocumentAbstractions";
import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
import { QueryOperator } from "../Queries/QueryOperator";
import { QueryStatistics } from "./QueryStatistics";
import { ValueCallback } from "../../Types/Callbacks";
import { QueryTimings } from "../Queries/Timings/QueryTimings";
import { IDocumentQuery } from "./IDocumentQuery";
import { IDocumentSession } from "./IDocumentSession";
import { DocumentQueryOptions } from "./QueryOptions";
export declare class GraphDocumentQuery<T extends object> extends AbstractDocumentQuery<T, GraphDocumentQuery<T>> implements IGraphDocumentQuery<T> {
    constructor(session: InMemoryDocumentSessionOperations, graphQuery: string, clazz: DocumentType<T>);
    usingDefaultOperator(queryOperator: QueryOperator): IGraphDocumentQuery<T>;
    waitForNonStaleResults(): IGraphDocumentQuery<T>;
    waitForNonStaleResults(waitTimeout?: number): IGraphDocumentQuery<T>;
    addParameter(name: string, value: any): IGraphDocumentQuery<T>;
    skip(count: number): IGraphDocumentQuery<T>;
    statistics(statsCallback: (stats: QueryStatistics) => void): IGraphDocumentQuery<T>;
    take(count: number): IGraphDocumentQuery<T>;
    noCaching(): IGraphDocumentQuery<T>;
    noTracking(): IGraphDocumentQuery<T>;
    timings(timings: ValueCallback<QueryTimings>): IGraphDocumentQuery<T>;
    withQuery<TOther extends object>(alias: string, query: IDocumentQuery<TOther>): IGraphDocumentQuery<T>;
    withQuery<TOther extends object>(alias: string, rawQuery: string, documentType: DocumentType<TOther>): IGraphDocumentQuery<T>;
    withQuery<TOther extends object>(alias: string, queryFactory: (builder: GraphDocumentQueryBuilder) => IDocumentQuery<TOther>): IGraphDocumentQuery<T>;
    withEdges(alias: string, edgeSelector: string, query: string): this;
    private _withInternal;
}
export declare class GraphDocumentQueryBuilder {
    private readonly _session;
    private readonly _parameterPrefix;
    constructor(session: IDocumentSession, parameterPrefix: string);
    query<T extends object>(documentType: DocumentType<T>): IDocumentQuery<T>;
    query<T extends object>(opts: DocumentQueryOptions<T>): IDocumentQuery<T>;
}
