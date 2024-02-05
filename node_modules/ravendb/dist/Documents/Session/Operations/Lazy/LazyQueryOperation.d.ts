import { ILazyOperation } from "./ILazyOperation";
import { ObjectTypeDescriptor } from "../../../../Types";
import { QueryResult } from "../../../Queries/QueryResult";
import { QueryOperation } from "../QueryOperation";
import { GetRequest } from "../../../Commands/MultiGet/GetRequest";
import { GetResponse } from "../../../Commands/MultiGet/GetResponse";
import { QueryEventsEmitter } from "../../../Session/QueryEvents";
import { InMemoryDocumentSessionOperations } from "../../InMemoryDocumentSessionOperations";
export declare class LazyQueryOperation<T extends object> implements ILazyOperation {
    private readonly _clazz;
    private readonly _session;
    private readonly _queryOperation;
    private readonly _parent;
    constructor(session: InMemoryDocumentSessionOperations, queryOperation: QueryOperation, parent: QueryEventsEmitter, clazz: ObjectTypeDescriptor<T>);
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
