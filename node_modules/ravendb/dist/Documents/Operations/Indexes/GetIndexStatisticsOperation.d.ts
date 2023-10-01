import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { IndexStats } from "../../Indexes/IndexStats";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
import { ServerNode } from "../../../Http/ServerNode";
export declare class GetIndexStatisticsOperation implements IMaintenanceOperation<IndexStats> {
    private readonly _indexName;
    constructor(indexName: string);
    getCommand(conventions: DocumentConventions): RavenCommand<IndexStats>;
    get resultType(): OperationResultType;
}
export declare class GetIndexStatisticsCommand extends RavenCommand<IndexStats> {
    private readonly _indexName;
    private readonly _conventions;
    constructor(indexName: string, conventions: DocumentConventions);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
