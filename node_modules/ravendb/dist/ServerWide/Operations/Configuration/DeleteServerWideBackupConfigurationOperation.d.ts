import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
export declare class DeleteServerWideBackupConfigurationOperation implements IServerOperation<void> {
    private readonly _name;
    constructor(name: string);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
