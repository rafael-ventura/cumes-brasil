import { ILazyOperation } from "./ILazyOperation";
import { QueryResult } from "../../../Queries/QueryResult";
import { GetRequest } from "../../../Commands/MultiGet/GetRequest";
import { GetResponse } from "../../../Commands/MultiGet/GetResponse";
import { IndexQuery } from "../../../Queries/IndexQuery";
import { SuggestionsResponseObject } from "../../../../Types";
import { InMemoryDocumentSessionOperations } from "../../InMemoryDocumentSessionOperations";
export declare class LazySuggestionQueryOperation implements ILazyOperation {
    private _result;
    private _queryResult;
    private _requiresRetry;
    private readonly _session;
    private readonly _indexQuery;
    private readonly _invokeAfterQueryExecuted;
    private readonly _processResults;
    constructor(session: InMemoryDocumentSessionOperations, indexQuery: IndexQuery, invokeAfterQueryExecuted: (result: QueryResult) => void, processResults: (result: QueryResult) => SuggestionsResponseObject);
    createRequest(): GetRequest;
    get result(): any;
    set result(result: any);
    get queryResult(): QueryResult;
    set queryResult(queryResult: QueryResult);
    get requiresRetry(): boolean;
    set requiresRetry(result: boolean);
    handleResponseAsync(response: GetResponse): Promise<void>;
    private _handleResponse;
}
