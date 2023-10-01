import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { UpdatePeriodicBackupOperationResult } from "./UpdatePeriodicBackupOperationResult";
import { PeriodicBackupConfiguration } from "./PeriodicBackupConfiguration";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class UpdatePeriodicBackupOperation implements IMaintenanceOperation<UpdatePeriodicBackupOperationResult> {
    private readonly _configuration;
    constructor(configuration: PeriodicBackupConfiguration);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<UpdatePeriodicBackupOperationResult>;
}
