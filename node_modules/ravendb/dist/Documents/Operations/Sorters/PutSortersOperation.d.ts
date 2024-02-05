import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { SorterDefinition } from "../../Queries/Sorting/SorterDefinition";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class PutSortersOperation implements IMaintenanceOperation<void> {
    private readonly _sortersToAdd;
    constructor(...sortersToAdd: SorterDefinition[]);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
