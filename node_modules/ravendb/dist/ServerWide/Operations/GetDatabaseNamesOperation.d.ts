import { IServerOperation, OperationResultType } from "../../Documents/Operations/OperationAbstractions";
import { RavenCommand } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters } from "../../Primitives/Http";
import * as stream from "readable-stream";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
export declare class GetDatabaseNamesOperation implements IServerOperation<string[]> {
    private readonly _start;
    private readonly _pageSize;
    constructor(start: number, pageSize: number);
    getCommand(conventions: DocumentConventions): RavenCommand<string[]>;
    get resultType(): OperationResultType;
}
export declare class GetDatabaseNamesCommand extends RavenCommand<string[]> {
    private readonly _start;
    private readonly _pageSize;
    constructor(start: number, pageSize: number);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
