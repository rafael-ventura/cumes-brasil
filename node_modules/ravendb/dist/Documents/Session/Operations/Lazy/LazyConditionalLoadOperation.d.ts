import { ILazyOperation } from "./ILazyOperation";
import { ObjectTypeDescriptor } from "../../../../Types";
import { InMemoryDocumentSessionOperations } from "../../InMemoryDocumentSessionOperations";
import { GetRequest } from "../../../Commands/MultiGet/GetRequest";
import { QueryResult } from "../../../Queries/QueryResult";
import { GetResponse } from "../../../Commands/MultiGet/GetResponse";
export declare class LazyConditionalLoadOperation<T extends object> implements ILazyOperation {
    private readonly _clazz;
    private readonly _session;
    private readonly _id;
    private readonly _changeVector;
    constructor(session: InMemoryDocumentSessionOperations, id: string, changeVector: string, clazz: ObjectTypeDescriptor<T>);
    createRequest(): GetRequest;
    private _result;
    private _requiresRetry;
    get queryResult(): QueryResult;
    get result(): any;
    get requiresRetry(): boolean;
    handleResponseAsync(response: GetResponse): Promise<void>;
}
