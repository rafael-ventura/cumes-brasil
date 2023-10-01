import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { StartBackupOperationResult } from "./StartBackupOperationResult";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class StartBackupOperation implements IMaintenanceOperation<StartBackupOperationResult> {
    private readonly _isFullBackup;
    private readonly _taskId;
    constructor(isFullBackup: boolean, taskId: number);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<StartBackupOperationResult>;
}
