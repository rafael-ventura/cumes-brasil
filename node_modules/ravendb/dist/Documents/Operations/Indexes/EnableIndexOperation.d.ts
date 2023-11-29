import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
import { IRaftCommand } from "../../../Http/IRaftCommand";
export declare class EnableIndexOperation implements IMaintenanceOperation<void> {
    private readonly _indexName;
    private readonly _clusterWide;
    constructor(indexName: string, clusterWide?: boolean);
    getCommand(conventions: DocumentConventions): EnableIndexCommand;
    get resultType(): OperationResultType;
}
export declare class EnableIndexCommand extends RavenCommand<void> implements IRaftCommand {
    private readonly _indexName;
    private readonly _clusterWide;
    constructor(indexName: string, clusterWide: boolean);
    createRequest(node: ServerNode): HttpRequestParameters;
    get isReadRequest(): boolean;
    getRaftUniqueRequestId(): string;
}
