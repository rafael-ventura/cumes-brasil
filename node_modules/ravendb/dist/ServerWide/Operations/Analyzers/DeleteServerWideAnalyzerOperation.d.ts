import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class DeleteServerWideAnalyzerOperation implements IServerOperation<void> {
    private readonly _analyzerName;
    constructor(analyzerName: string);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
