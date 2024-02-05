import { ILazyOperation } from "./ILazyOperation";
import { InMemoryDocumentSessionOperations } from "../../InMemoryDocumentSessionOperations";
import { SessionLoadStartingWithOptions } from "../../IDocumentSession";
import { GetRequest } from "../../../Commands/MultiGet/GetRequest";
import { QueryResult } from "../../../Queries/QueryResult";
import { GetResponse } from "../../../Commands/MultiGet/GetResponse";
export declare class LazyStartsWithOperation<T extends object> implements ILazyOperation {
    private readonly _clazz;
    private readonly _idPrefix;
    private readonly _matches;
    private readonly _exclude;
    private readonly _start;
    private readonly _pageSize;
    private readonly _sessionOperations;
    private readonly _startAfter;
    constructor(idPrefix: string, opts: SessionLoadStartingWithOptions<T>, sessionOperations: InMemoryDocumentSessionOperations);
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
}
