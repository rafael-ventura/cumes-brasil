import { HttpRequestParameters } from "../../../Primitives/Http";
import { ConnectionString } from "../Etl/ConnectionString";
import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
import * as stream from "readable-stream";
import { IRaftCommand } from "../../../Http/IRaftCommand";
export interface PutConnectionStringResult {
    raftCommandIndex: number;
}
export declare class PutConnectionStringOperation<T extends ConnectionString> implements IMaintenanceOperation<PutConnectionStringResult> {
    private readonly _connectionString;
    constructor(connectionString: T);
    getCommand(conventions: DocumentConventions): RavenCommand<PutConnectionStringResult>;
    get resultType(): OperationResultType;
}
export declare class PutConnectionStringCommand<T extends ConnectionString> extends RavenCommand<PutConnectionStringResult> implements IRaftCommand {
    private readonly _connectionString;
    constructor(connectionString: T);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    getRaftUniqueRequestId(): string;
}
