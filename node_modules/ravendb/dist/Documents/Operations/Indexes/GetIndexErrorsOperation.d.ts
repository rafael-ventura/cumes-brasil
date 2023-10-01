import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { IndexErrors } from "../../Indexes/Errors";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { ServerNode } from "../../../Http/ServerNode";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
export declare class GetIndexErrorsOperation implements IMaintenanceOperation<IndexErrors[]> {
    private readonly _indexNames;
    constructor();
    constructor(indexNames: string[]);
    getCommand(conventions: DocumentConventions): RavenCommand<IndexErrors[]>;
    get resultType(): OperationResultType;
}
export declare class GetIndexErrorsCommand extends RavenCommand<IndexErrors[]> {
    private readonly _indexNames;
    private readonly _conventions;
    constructor(indexNames: string[], conventions: DocumentConventions);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
