import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { IndexPriority } from "../../Indexes/Enums";
import { ServerNode } from "../../../Http/ServerNode";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { IRaftCommand } from "../../../Http/IRaftCommand";
export declare class SetIndexesPriorityOperation implements IMaintenanceOperation<void> {
    private readonly _parameters;
    constructor(indexName: string, priority: IndexPriority);
    constructor(parameters: SetIndexesPriorityOperationParameters);
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
    get resultType(): OperationResultType;
}
export declare class SetIndexPriorityCommand extends RavenCommand<void> implements IRaftCommand {
    private readonly _parameters;
    constructor(conventions: DocumentConventions, parameters: SetIndexesPriorityOperationParameters);
    createRequest(node: ServerNode): HttpRequestParameters;
    get isReadRequest(): boolean;
    getRaftUniqueRequestId(): string;
}
export interface SetIndexesPriorityOperationParameters {
    indexNames: string[];
    priority: IndexPriority;
}
