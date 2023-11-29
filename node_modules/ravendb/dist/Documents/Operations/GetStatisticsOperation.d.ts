import { IMaintenanceOperation, OperationResultType } from "./OperationAbstractions";
import { ServerNode } from "../../Http/ServerNode";
import { RavenCommand } from "../../Http/RavenCommand";
import { HttpRequestParameters } from "../../Primitives/Http";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { DatabaseStatistics } from "./DatabaseStatistics";
import * as stream from "readable-stream";
export declare class GetStatisticsOperation implements IMaintenanceOperation<DatabaseStatistics> {
    get resultType(): OperationResultType;
    private readonly _debugTag;
    private readonly _nodeTag;
    constructor();
    constructor(debugTag: string);
    constructor(debugTag: string, nodeTag: string);
    getCommand(conventions: DocumentConventions): RavenCommand<DatabaseStatistics>;
}
export declare class GetStatisticsCommand extends RavenCommand<DatabaseStatistics> {
    private readonly _debugTag;
    constructor(debugTag?: string, nodeTag?: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
