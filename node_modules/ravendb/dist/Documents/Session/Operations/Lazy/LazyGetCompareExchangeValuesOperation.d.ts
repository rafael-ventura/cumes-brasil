import { ILazyOperation } from "./ILazyOperation";
import { ClusterTransactionOperationsBase } from "../../ClusterTransactionOperationsBase";
import { CompareExchangeResultClass } from "../../../../Types";
import { GetRequest } from "../../../Commands/MultiGet/GetRequest";
import { GetResponse } from "../../../Commands/MultiGet/GetResponse";
import { DocumentConventions } from "../../../Conventions/DocumentConventions";
import { QueryResult } from "../../../Queries/QueryResult";
export declare class LazyGetCompareExchangeValuesOperation<T> implements ILazyOperation {
    private readonly _clusterSession;
    private readonly _clazz;
    private readonly _conventions;
    private readonly _startsWith;
    private readonly _start;
    private readonly _pageSize;
    private readonly _keys;
    private _result;
    private _requiresRetry;
    constructor(clusterSession: ClusterTransactionOperationsBase, clazz: CompareExchangeResultClass<T>, conventions: DocumentConventions, keys: string[]);
    constructor(clusterSession: ClusterTransactionOperationsBase, clazz: CompareExchangeResultClass<T>, conventions: DocumentConventions, startsWith: string, start: number, pageSize: number);
    get result(): object;
    get queryResult(): QueryResult;
    get requiresRetry(): boolean;
    createRequest(): GetRequest;
    handleResponseAsync(response: GetResponse): Promise<void>;
}
