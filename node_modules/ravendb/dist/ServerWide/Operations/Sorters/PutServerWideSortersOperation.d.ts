import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { SorterDefinition } from "../../../Documents/Queries/Sorting/SorterDefinition";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class PutServerWideSortersOperation implements IServerOperation<void> {
    private readonly _sortersToAdd;
    constructor(...sortersToAdd: SorterDefinition[]);
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
    get resultType(): OperationResultType;
}
