import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { DatabasePutResult } from "./index";
import { RavenCommand } from "../../Http/RavenCommand";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
export declare class PromoteDatabaseNodeOperation implements IServerOperation<DatabasePutResult> {
    private readonly _databaseName;
    private readonly _node;
    constructor(databaseName: string, node: string);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<DatabasePutResult>;
}
