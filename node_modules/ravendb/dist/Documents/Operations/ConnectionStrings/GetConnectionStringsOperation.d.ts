import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
import { ConnectionStringType, SqlConnectionString, RavenConnectionString, OlapConnectionString } from "../Etl/ConnectionString";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { OperationResultType, IMaintenanceOperation } from "../OperationAbstractions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
export interface GetConnectionStringsResult {
    ravenConnectionStrings: Record<string, RavenConnectionString>;
    sqlConnectionStrings: Record<string, SqlConnectionString>;
    olapConnectionStrings: Record<string, OlapConnectionString>;
}
export declare class GetConnectionStringsOperation implements IMaintenanceOperation<GetConnectionStringsResult> {
    private readonly _connectionStringName;
    private readonly _type;
    constructor();
    constructor(connectionStringName: string, type: ConnectionStringType);
    getCommand(conventions: DocumentConventions): RavenCommand<GetConnectionStringsResult>;
    get resultType(): OperationResultType;
}
export declare class GetConnectionStringCommand extends RavenCommand<GetConnectionStringsResult> {
    private readonly _connectionStringName;
    private readonly _type;
    constructor(connectionStringName: string, type: ConnectionStringType);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
