import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { ServerWideBackupConfiguration } from "./ServerWideBackupConfiguration";
export declare class GetServerWideBackupConfigurationsOperation implements IServerOperation<ServerWideBackupConfiguration[]> {
    getCommand(conventions: DocumentConventions): RavenCommand<ServerWideBackupConfiguration[]>;
    get resultType(): OperationResultType;
}
