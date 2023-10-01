import { HttpRequestParameters } from "../../../Primitives/Http";
import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
import { IRaftCommand } from "../../../Http/IRaftCommand";
export declare class DisableIndexOperation implements IMaintenanceOperation<void> {
    private readonly _indexName;
    private readonly _clusterWide;
    constructor(indexName: string, clusterWide?: boolean);
    getCommand(conventions: DocumentConventions): DisableIndexCommand;
    get resultType(): OperationResultType;
}
export declare class DisableIndexCommand extends RavenCommand<void> implements IRaftCommand {
    get isReadRequest(): boolean;
    private readonly _indexName;
    private readonly _clusterWide;
    constructor(indexName: string, clusterWide: boolean);
    createRequest(node: ServerNode): HttpRequestParameters;
    getRaftUniqueRequestId(): string;
}
