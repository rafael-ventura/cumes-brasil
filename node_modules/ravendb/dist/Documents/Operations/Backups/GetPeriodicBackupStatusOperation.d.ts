import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { GetPeriodicBackupStatusOperationResult } from "./GetPeriodicBackupStatusOperationResult";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class GetPeriodicBackupStatusOperation implements IMaintenanceOperation<GetPeriodicBackupStatusOperationResult> {
    private readonly _taskId;
    constructor(taskId: number);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<GetPeriodicBackupStatusOperationResult>;
}
