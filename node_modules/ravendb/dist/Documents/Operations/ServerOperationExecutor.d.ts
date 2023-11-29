import { IDisposable } from "../../Types/Contracts";
import { DocumentStoreBase } from "../DocumentStoreBase";
import { IServerOperation, AwaitableServerOperation } from "./OperationAbstractions";
import { ClusterRequestExecutor } from "../../Http/ClusterRequestExecutor";
import { ServerWideOperationCompletionAwaiter } from "../../ServerWide/Operations/ServerWideOperationCompletionAwaiter";
export declare class ServerOperationExecutor implements IDisposable {
    private readonly _cache;
    private readonly _nodeTag;
    private readonly _store;
    private readonly _requestExecutor;
    private readonly _initialRequestExecutor;
    constructor(store: DocumentStoreBase);
    constructor(store: DocumentStoreBase, requestExecutor: ClusterRequestExecutor, initialRequestExecutor: ClusterRequestExecutor, cache: Map<string, ServerOperationExecutor>, nodeTag: string);
    forNode(nodeTag: string): Promise<ServerOperationExecutor>;
    send(operation: AwaitableServerOperation): Promise<ServerWideOperationCompletionAwaiter>;
    send<TResult>(operation: IServerOperation<TResult>): Promise<TResult>;
    dispose(): void;
    private _getTopology;
    private static _createRequestExecutor;
}
