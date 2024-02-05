import { InMemoryDocumentSessionOperations } from "../../Session/InMemoryDocumentSessionOperations";
import { IndexQuery } from "../IndexQuery";
import { FacetResult } from ".";
import { QueryResult } from "../QueryResult";
import { Lazy } from "../../Lazy";
export interface FacetResultObject {
    [key: string]: FacetResult;
}
export declare abstract class AggregationQueryBase {
    private readonly _session;
    private _query;
    private _duration;
    protected constructor(session: InMemoryDocumentSessionOperations);
    execute(): Promise<FacetResultObject>;
    executeLazy(): Lazy<FacetResultObject>;
    protected abstract _getIndexQuery(updateAfterQueryExecuted?: boolean): IndexQuery;
    abstract emit(evtName: "afterQueryExecuted", queryResult: QueryResult): any;
    private _processResults;
    private _getCommand;
    toString(): string;
}
