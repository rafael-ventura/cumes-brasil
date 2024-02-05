import { ILazyOperation } from "./ILazyOperation";
import { ClusterTransactionOperationsBase } from "../../ClusterTransactionOperationsBase";
import { GetRequest } from "../../../Commands/MultiGet/GetRequest";
import { GetResponse } from "../../../Commands/MultiGet/GetResponse";
import { CompareExchangeResultClass } from "../../../../Types";
import { DocumentConventions } from "../../../Conventions/DocumentConventions";
import { QueryResult } from "../../../Queries/QueryResult";
export declare class LazyGetCompareExchangeValueOperation<T> implements ILazyOperation {
    private readonly _clusterSession;
    private readonly _clazz;
    private readonly _conventions;
    private readonly _key;
    private _result;
    private _requiresRetry;
    constructor(clusterSession: ClusterTransactionOperationsBase, clazz: CompareExchangeResultClass<T>, conventions: DocumentConventions, key: string);
    get result(): object;
    get queryResult(): QueryResult;
    get requiresRetry(): boolean;
    createRequest(): GetRequest;
    handleResponseAsync(response: GetResponse): Promise<void>;
}
