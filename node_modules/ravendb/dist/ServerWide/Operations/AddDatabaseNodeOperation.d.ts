import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { DatabasePutResult } from "./index";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../Http/RavenCommand";
export declare class AddDatabaseNodeOperation implements IServerOperation<DatabasePutResult> {
    private readonly _databaseName;
    private readonly _node;
    constructor(databaseName: string, node?: string);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<DatabasePutResult>;
}
