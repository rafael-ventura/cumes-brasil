import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { RevisionsCollectionConfiguration } from "../../Documents/Operations/RevisionsCollectionConfiguration";
import { RavenCommand } from "../../Http/RavenCommand";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
export declare class ConfigureRevisionsForConflictsOperation implements IServerOperation<ConfigureRevisionsForConflictsResult> {
    private readonly _database;
    private readonly _configuration;
    constructor(database: string, configuration: RevisionsCollectionConfiguration);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<ConfigureRevisionsForConflictsResult>;
}
export declare class ConfigureRevisionsForConflictsResult {
    raftCommandIndex: number;
}
