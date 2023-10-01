import { HttpRequestParameters } from "../../../Primitives/Http";
import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
import { IRaftCommand } from "../../../Http/IRaftCommand";
export declare class DeleteIndexOperation implements IMaintenanceOperation<void> {
    private readonly _indexName;
    constructor(indexName: string);
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
    get resultType(): OperationResultType;
}
export declare class DeleteIndexCommand extends RavenCommand<void> implements IRaftCommand {
    private readonly _indexName;
    constructor(indexName: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    get isReadRequest(): boolean;
    getRaftUniqueRequestId(): string;
}
