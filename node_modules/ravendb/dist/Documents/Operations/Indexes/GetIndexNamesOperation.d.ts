import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { ServerNode } from "../../../Http/ServerNode";
export declare class GetIndexNamesOperation implements IMaintenanceOperation<string[]> {
    get resultType(): OperationResultType;
    private readonly _start;
    private readonly _pageSize;
    constructor(start: number, pageSize: number);
    getCommand(conventions: DocumentConventions): RavenCommand<string[]>;
}
export declare class GetIndexNamesCommand extends RavenCommand<string[]> {
    private readonly _start;
    private readonly _pageSize;
    constructor(start: number, pageSize: number);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
