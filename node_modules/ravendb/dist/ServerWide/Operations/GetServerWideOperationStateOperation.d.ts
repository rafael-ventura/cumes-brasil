import { HttpRequestParameters } from "../../Primitives/Http";
import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { RavenCommand, IRavenResponse } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import * as stream from "readable-stream";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
export declare class GetServerWideOperationStateOperation implements IServerOperation<IRavenResponse> {
    get resultType(): OperationResultType;
    private readonly _id;
    constructor(id: number);
    getCommand(conventions: DocumentConventions): RavenCommand<IRavenResponse>;
}
export declare class GetServerWideOperationStateCommand extends RavenCommand<IRavenResponse> {
    private readonly _id;
    constructor(id: number);
    constructor(id: number, nodeTag: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    get isReadRequest(): boolean;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
