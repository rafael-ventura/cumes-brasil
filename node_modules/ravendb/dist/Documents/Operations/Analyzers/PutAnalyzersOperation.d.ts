import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { AnalyzerDefinition } from "../../Indexes/Analysis/AnalyzerDefinition";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class PutAnalyzersOperation implements IMaintenanceOperation<void> {
    private readonly _analyzersToAdd;
    constructor(...analyzersToAdd: AnalyzerDefinition[]);
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
    get resultType(): OperationResultType;
}
