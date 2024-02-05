import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../Http/RavenCommand";
export declare class SetDatabaseDynamicDistributionOperation implements IServerOperation<void> {
    private readonly _allowDynamicDistribution;
    private readonly _databaseName;
    constructor(databaseName: string, allowDynamicDistribution: boolean);
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
    get resultType(): OperationResultType;
}
