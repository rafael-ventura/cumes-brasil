import * as stream from "readable-stream";
import { HttpRequestParameters } from "../../Primitives/Http";
import { RavenCommand } from "../../Http/RavenCommand";
import { DatabasePutResult } from ".";
import { ServerNode } from "../../Http/ServerNode";
import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { DatabaseRecord } from "..";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
import { IRaftCommand } from "../../Http/IRaftCommand";
export declare class CreateDatabaseOperation implements IServerOperation<DatabasePutResult> {
    get resultType(): OperationResultType;
    private readonly _databaseRecord;
    private readonly _replicationFactor;
    constructor(databaseRecord: DatabaseRecord, replicationFactor?: number);
    getCommand(conventions: DocumentConventions): RavenCommand<DatabasePutResult>;
}
export declare class CreateDatabaseCommand extends RavenCommand<DatabasePutResult> implements IRaftCommand {
    private _conventions;
    private readonly _databaseRecord;
    private readonly _replicationFactor;
    private readonly _etag;
    private readonly _databaseName;
    constructor(conventions: DocumentConventions, databaseRecord: DatabaseRecord, replicationFactor: number, etag?: number);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
    getRaftUniqueRequestId(): string;
}
