import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class DeleteSorterOperation implements IMaintenanceOperation<void> {
    private readonly _sorterName;
    constructor(sorterName: string);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
