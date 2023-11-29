import { IMaintenanceOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DatabaseSettings } from "./DatabaseSettings";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
export declare class GetDatabaseSettingsOperation implements IMaintenanceOperation<DatabaseSettings> {
    private readonly _databaseName;
    get resultType(): OperationResultType;
    constructor(databaseName: string);
    getCommand(conventions: DocumentConventions): RavenCommand<DatabaseSettings>;
}
