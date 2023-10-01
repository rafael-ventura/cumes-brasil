import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class DeleteIndexErrorsOperation implements IMaintenanceOperation<void> {
    private readonly _indexNames;
    constructor();
    constructor(indexNames: string[]);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
