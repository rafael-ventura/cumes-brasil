import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { AnalyzerDefinition } from "../../../Documents/Indexes/Analysis/AnalyzerDefinition";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class PutServerWideAnalyzersOperation implements IServerOperation<void> {
    private readonly _analyzersToAdd;
    constructor(...analyzersToAdd: AnalyzerDefinition[]);
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
    get resultType(): OperationResultType;
}
