import { ILazyOperation } from "./ILazyOperation";
import { QueryResult } from "../../../Queries/QueryResult";
import { IndexQuery } from "../../../Queries/IndexQuery";
import { FacetResultObject, AggregationQueryBase } from "../../../Queries/Facets/AggregationQueryBase";
import { GetRequest } from "../../../Commands/MultiGet/GetRequest";
import { GetResponse } from "../../../Commands/MultiGet/GetResponse";
import { InMemoryDocumentSessionOperations } from "../../InMemoryDocumentSessionOperations";
export declare class LazyAggregationQueryOperation implements ILazyOperation {
    private readonly _session;
    private readonly _indexQuery;
    private readonly _parent;
    private readonly _processResults;
    constructor(session: InMemoryDocumentSessionOperations, indexQuery: IndexQuery, parent: AggregationQueryBase, processResults: (queryResult: QueryResult) => FacetResultObject);
    createRequest(): GetRequest;
    private _result;
    private _queryResult;
    private _requiresRetry;
    get result(): any;
    set result(result: any);
    get queryResult(): QueryResult;
    set queryResult(queryResult: QueryResult);
    get requiresRetry(): boolean;
    set requiresRetry(result: boolean);
    handleResponseAsync(response: GetResponse): Promise<void>;
    private _handleResponse;
}
