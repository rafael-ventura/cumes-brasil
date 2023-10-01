import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { ServerWideBackupConfiguration } from "./ServerWideBackupConfiguration";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { PutServerWideBackupConfigurationResponse } from "../OngoingTasks/ServerWideTaskResponse";
export declare class PutServerWideBackupConfigurationOperation implements IServerOperation<PutServerWideBackupConfigurationResponse> {
    private readonly _configuration;
    constructor(configuration: ServerWideBackupConfiguration);
    getCommand(conventions: DocumentConventions): RavenCommand<PutServerWideBackupConfigurationResponse>;
    get resultType(): OperationResultType;
}
