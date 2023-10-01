import { HttpRequestParameters } from "../../../Primitives/Http";
import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { IndexLockMode } from "../../Indexes/Enums";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { ServerNode } from "../../../Http/ServerNode";
import { IRaftCommand } from "../../../Http/IRaftCommand";
export declare class SetIndexesLockOperation implements IMaintenanceOperation<void> {
    private readonly _parameters;
    constructor(indexName: string, mode: IndexLockMode);
    constructor(parameters: SetIndexesLockOperationParameters);
    private _filterAutoIndexes;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
    get resultType(): OperationResultType;
}
export declare class SetIndexLockCommand extends RavenCommand<void> implements IRaftCommand {
    private readonly _parameters;
    constructor(conventions: DocumentConventions, parameters: SetIndexesLockOperationParameters);
    createRequest(node: ServerNode): HttpRequestParameters;
    get isReadRequest(): boolean;
    getRaftUniqueRequestId(): string;
}
export interface SetIndexesLockOperationParameters {
    indexNames: string[];
    mode: IndexLockMode;
}
