import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { IndexStats } from "../../Indexes/IndexStats";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { ServerNode } from "../../../Http/ServerNode";
import { RavenCommand } from "../../../Http/RavenCommand";
import * as stream from "readable-stream";
export declare class GetIndexesStatisticsOperation implements IMaintenanceOperation<IndexStats[]> {
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<IndexStats[]>;
}
export declare class GetIndexesStatisticsCommand extends RavenCommand<IndexStats[]> {
    private readonly _conventions;
    constructor(conventions: DocumentConventions);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
