import * as stream from "readable-stream";
import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { RavenCommand } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters } from "../../Primitives/Http";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
import { IRaftCommand } from "../../Http/IRaftCommand";
export interface DeleteDatabaseResult {
    raftCommandIndex: number;
    pendingDeletes: string[];
}
export interface DeleteDatabasesParameters {
    databaseNames: string[];
    hardDelete: boolean;
    fromNodes?: string | string[];
    timeToWaitForConfirmation?: number;
}
export declare class DeleteDatabasesOperation implements IServerOperation<DeleteDatabaseResult> {
    get resultType(): OperationResultType;
    private readonly _parameters;
    constructor(parameters: DeleteDatabasesParameters);
    getCommand(conventions: DocumentConventions): RavenCommand<DeleteDatabaseResult>;
}
export declare class DeleteDatabaseCommand extends RavenCommand<DeleteDatabaseResult> implements IRaftCommand {
    private readonly _parameters;
    constructor(conventions: DocumentConventions, parameters: DeleteDatabasesParameters);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
    getRaftUniqueRequestId(): string;
}
