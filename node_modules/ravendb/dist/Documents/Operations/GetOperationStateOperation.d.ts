import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters } from "../../Primitives/Http";
import { RavenCommand, IRavenResponse } from "../../Http/RavenCommand";
import { IMaintenanceOperation, OperationResultType } from "./OperationAbstractions";
import * as stream from "readable-stream";
import { DocumentConventions } from "../Conventions/DocumentConventions";
export declare class GetOperationStateOperation implements IMaintenanceOperation<IRavenResponse> {
    private readonly _id;
    private readonly _nodeTag;
    constructor(id: number, nodeTag?: string);
    getCommand(conventions: DocumentConventions): RavenCommand<IRavenResponse>;
    get resultType(): OperationResultType;
}
export declare class GetOperationStateCommand extends RavenCommand<IRavenResponse> {
    get isReadRequest(): boolean;
    private readonly _id;
    constructor(id: number, nodeTag?: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
