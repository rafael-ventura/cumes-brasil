import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { IndexDefinition } from "../../Indexes/IndexDefinition";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { ServerNode } from "../../../Http/ServerNode";
import * as stream from "readable-stream";
export declare class GetIndexOperation implements IMaintenanceOperation<IndexDefinition> {
    private readonly _indexName;
    constructor(indexName: string);
    getCommand(conventions: DocumentConventions): RavenCommand<IndexDefinition>;
    get resultType(): OperationResultType;
}
export declare class GetIndexCommand extends RavenCommand<IndexDefinition> {
    private readonly _indexName;
    private readonly _conventions;
    constructor(indexName: string, conventions: DocumentConventions);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
