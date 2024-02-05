import { IServerOperation, OperationIdResult, OperationResultType } from "../OperationAbstractions";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { RestoreBackupConfigurationBase } from "./RestoreBackupConfigurationBase";
export declare class RestoreBackupOperation implements IServerOperation<OperationIdResult> {
    private readonly _restoreConfiguration;
    private readonly _nodeTag;
    constructor(restoreConfiguration: RestoreBackupConfigurationBase, nodeTag?: string);
    getCommand(conventions: DocumentConventions): RavenCommand<OperationIdResult>;
    get resultType(): OperationResultType;
    get nodeTag(): string;
}
