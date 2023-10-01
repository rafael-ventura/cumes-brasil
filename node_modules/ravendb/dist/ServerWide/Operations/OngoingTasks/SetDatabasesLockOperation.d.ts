import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DatabaseLockMode } from "../../index";
export declare class SetDatabasesLockOperation implements IServerOperation<void> {
    private readonly _parameters;
    constructor(databaseName: string, mode: DatabaseLockMode);
    constructor(parameters: SetDatabasesLockParameters);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
export interface SetDatabasesLockParameters {
    databaseNames: string[];
    mode: DatabaseLockMode;
}
