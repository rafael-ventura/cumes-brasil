import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { ServerNode } from "../../../Http/ServerNode";
import { IndexingStatus } from "../../Indexes/IndexingStatus";
import * as stream from "readable-stream";
export declare class GetIndexingStatusOperation implements IMaintenanceOperation<IndexingStatus> {
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<IndexingStatus>;
}
export declare class GetIndexingStatusCommand extends RavenCommand<IndexingStatus> {
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
