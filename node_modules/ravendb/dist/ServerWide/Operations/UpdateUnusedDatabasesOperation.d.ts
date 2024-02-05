import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { RavenCommand } from "../../Http/RavenCommand";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
export declare class UpdateUnusedDatabasesOperation implements IServerOperation<void> {
    private readonly _database;
    private readonly _parameters;
    constructor(database: string, unusedDatabaseIds: string[]);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
export interface UpdateUnusedDatabasesParameters {
    databaseIds: string[];
}
