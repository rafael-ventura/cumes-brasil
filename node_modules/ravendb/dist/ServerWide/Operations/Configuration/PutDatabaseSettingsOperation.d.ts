import { IMaintenanceOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
export declare class PutDatabaseSettingsOperation implements IMaintenanceOperation<void> {
    private readonly _databaseName;
    private readonly _configurationSettings;
    constructor(databaseName: string, configurationSettings: Record<string, string>);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
