import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../Http/RavenCommand";
export declare class ReorderDatabaseMembersOperation implements IServerOperation<void> {
    private readonly _database;
    private readonly _parameters;
    constructor(database: string, order: string[], fixed?: boolean);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
export interface ReorderDatabaseMembersParameters {
    membersOrder: string[];
    fixed: boolean;
}
