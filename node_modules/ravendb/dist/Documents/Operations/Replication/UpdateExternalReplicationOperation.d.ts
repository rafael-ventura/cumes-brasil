import { HttpRequestParameters } from "../../../Primitives/Http";
import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { ModifyOngoingTaskResult } from "../../../ServerWide/ModifyOnGoingTaskResult";
import { ExternalReplication } from "../../Replication/ExternalReplication";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { ServerNode } from "../../../Http/ServerNode";
import * as stream from "readable-stream";
import { IRaftCommand } from "../../../Http/IRaftCommand";
export declare class UpdateExternalReplicationOperation implements IMaintenanceOperation<ModifyOngoingTaskResult> {
    private readonly _newWatcher;
    constructor(newWatcher: ExternalReplication);
    getCommand(conventions: DocumentConventions): RavenCommand<ModifyOngoingTaskResult>;
    get resultType(): OperationResultType;
}
export declare class UpdateExternalReplicationCommand extends RavenCommand<ModifyOngoingTaskResult> implements IRaftCommand {
    private readonly _newWatcher;
    constructor(newWatcher: ExternalReplication);
    createRequest(node: ServerNode): HttpRequestParameters;
    get isReadRequest(): boolean;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    getRaftUniqueRequestId(): string;
}
