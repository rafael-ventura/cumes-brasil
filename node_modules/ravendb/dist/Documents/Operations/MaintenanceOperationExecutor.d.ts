import { OperationCompletionAwaiter } from "./OperationCompletionAwaiter";
import { DocumentStoreBase } from "../DocumentStoreBase";
import { IMaintenanceOperation, AwaitableMaintenanceOperation } from "./OperationAbstractions";
import { ServerOperationExecutor } from "./ServerOperationExecutor";
export declare class MaintenanceOperationExecutor {
    private readonly _store;
    private readonly _databaseName;
    private _requestExecutor;
    private _serverOperationExecutor;
    constructor(store: DocumentStoreBase, databaseName?: string);
    private get requestExecutor();
    get server(): ServerOperationExecutor;
    forDatabase(databaseName: string): MaintenanceOperationExecutor;
    send(operation: AwaitableMaintenanceOperation): Promise<OperationCompletionAwaiter>;
    send<TResult>(operation: IMaintenanceOperation<TResult>): Promise<TResult>;
    private _assertDatabaseNameSet;
}
