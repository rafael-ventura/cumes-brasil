import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { ConnectionString } from "../Etl/ConnectionString";
import { ServerNode } from "../../../Http/ServerNode";
import { IRaftCommand } from "../../../Http/IRaftCommand";
export declare class RemoveConnectionStringOperation<T extends ConnectionString> implements IMaintenanceOperation<RemoveConnectionStringResult> {
    private readonly _connectionString;
    constructor(connectionString: T);
    getCommand(conventions: DocumentConventions): RavenCommand<RemoveConnectionStringResult>;
    get resultType(): OperationResultType;
}
export declare class RemoveConnectionStringCommand<T extends ConnectionString> extends RavenCommand<RemoveConnectionStringResult> implements IRaftCommand {
    private readonly _connectionString;
    constructor(connectionString: T);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    getRaftUniqueRequestId(): string;
}
export interface RemoveConnectionStringResult {
    raftCommandIndex: number;
}
