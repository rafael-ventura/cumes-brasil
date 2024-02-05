import { IMaintenanceOperation, OperationResultType } from "./OperationAbstractions";
import { DetailedDatabaseStatistics } from "./DetailedDatabaseStatistics";
import { RavenCommand } from "../../Http/RavenCommand";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters } from "../../Primitives/Http";
import * as stream from "readable-stream";
export declare class GetDetailedStatisticsOperation implements IMaintenanceOperation<DetailedDatabaseStatistics> {
    private readonly _debugTag;
    constructor();
    constructor(debugTag: string);
    getCommand(conventions: DocumentConventions): RavenCommand<DetailedDatabaseStatistics>;
    get resultType(): OperationResultType;
}
export declare class DetailedDatabaseStatisticsCommand extends RavenCommand<DetailedDatabaseStatistics> {
    private readonly _debugTag;
    constructor(debugTag: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
