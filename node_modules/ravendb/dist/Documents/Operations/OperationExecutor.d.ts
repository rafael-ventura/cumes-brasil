import { OperationCompletionAwaiter } from "./OperationCompletionAwaiter";
import { IOperation, AwaitableOperation } from "./OperationAbstractions";
import { DocumentStoreBase } from "../DocumentStoreBase";
import { SessionInfo } from "../Session/IDocumentSession";
import { PatchOperation, PatchOperationResult } from "./PatchOperation";
import { DocumentType } from "../DocumentAbstractions";
import { IDocumentStore } from "../IDocumentStore";
export declare class OperationExecutor {
    private readonly _store;
    private readonly _databaseName;
    private readonly _requestExecutor;
    constructor(store: DocumentStoreBase);
    constructor(store: IDocumentStore, databaseName?: string);
    forDatabase(databaseName: string): OperationExecutor;
    send(operation: AwaitableOperation): Promise<OperationCompletionAwaiter>;
    send(operation: AwaitableOperation, sessionInfo?: SessionInfo): Promise<OperationCompletionAwaiter>;
    send<TResult extends object>(patchOperation: PatchOperation): Promise<PatchOperationResult<TResult>>;
    send<TResult extends object>(patchOperation: PatchOperation, sessionInfo: SessionInfo): Promise<PatchOperationResult<TResult>>;
    send<TResult extends object>(patchOperation: PatchOperation, sessionInfo: SessionInfo, resultType: DocumentType<TResult>): Promise<PatchOperationResult<TResult>>;
    send<TResult>(operation: IOperation<TResult>): Promise<TResult>;
    send<TResult>(operation: IOperation<TResult>, sessionInfo?: SessionInfo): Promise<TResult>;
}
