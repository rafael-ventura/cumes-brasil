import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerWideBackupConfiguration } from "./ServerWideBackupConfiguration";
export declare class GetServerWideBackupConfigurationOperation implements IServerOperation<ServerWideBackupConfiguration> {
    private readonly _name;
    constructor(name: string);
    getCommand(conventions: DocumentConventions): RavenCommand<ServerWideBackupConfiguration>;
    get resultType(): OperationResultType;
}
