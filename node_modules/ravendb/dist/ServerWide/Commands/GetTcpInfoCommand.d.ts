import { RavenCommand } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters } from "../../Primitives/Http";
import * as stream from "readable-stream";
export declare class TcpConnectionInfo {
    url: string;
    certificate: string;
    urls: string[];
    nodeTag: string;
    serverId: string;
}
export declare class GetTcpInfoCommand extends RavenCommand<TcpConnectionInfo> {
    private readonly _tag;
    private readonly _dbName;
    requestedNode: ServerNode;
    constructor(tag: string);
    constructor(tag: string, dbName: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
