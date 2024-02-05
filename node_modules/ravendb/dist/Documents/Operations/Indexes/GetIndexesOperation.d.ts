import { HttpRequestParameters } from "../../../Primitives/Http";
import { ServerNode } from "../../../Http/ServerNode";
import { RavenCommand } from "../../../Http/RavenCommand";
import { IndexDefinition } from "../../Indexes/IndexDefinition";
import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import * as stream from "readable-stream";
export declare class GetIndexesOperation implements IMaintenanceOperation<IndexDefinition[]> {
    private readonly _start;
    private readonly _pageSize;
    constructor(start: number, pageSize: number);
    getCommand(conventions: DocumentConventions): RavenCommand<IndexDefinition[]>;
    get resultType(): OperationResultType;
}
export declare class GetIndexesCommand extends RavenCommand<IndexDefinition[]> {
    private readonly _start;
    private readonly _pageSize;
    private readonly _conventions;
    constructor(start: number, pageSize: number, conventions: DocumentConventions);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
