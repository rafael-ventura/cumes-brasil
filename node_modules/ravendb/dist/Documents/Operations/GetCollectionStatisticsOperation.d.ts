import { HttpRequestParameters } from "../../Primitives/Http";
import { IMaintenanceOperation, OperationResultType } from "./OperationAbstractions";
import { CollectionStatistics } from "./CollectionStatistics";
import { RavenCommand } from "../../Http/RavenCommand";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { ServerNode } from "../../Http/ServerNode";
import { JsonSerializer } from "../../Mapping/Json/Serializer";
import * as stream from "readable-stream";
export declare class GetCollectionStatisticsOperation implements IMaintenanceOperation<CollectionStatistics> {
    getCommand(conventions: DocumentConventions): RavenCommand<CollectionStatistics>;
    get resultType(): OperationResultType;
}
export declare class GetCollectionStatisticsCommand extends RavenCommand<CollectionStatistics> {
    constructor();
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    protected get _serializer(): JsonSerializer;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
