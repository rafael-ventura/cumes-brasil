import { RavenCommand } from "../../Http/RavenCommand";
import { TcpConnectionInfo } from "../../ServerWide/Commands/GetTcpInfoCommand";
import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters } from "../../Primitives/Http";
import * as stream from "readable-stream";
export declare class GetTcpInfoForRemoteTaskCommand extends RavenCommand<TcpConnectionInfo> {
    private readonly _remoteDatabase;
    private readonly _remoteTask;
    private readonly _tag;
    private _verifyDatabase;
    private _requestedNode;
    constructor(tag: string, remoteDatabase: string, remoteTask: string, verifyDatabase?: boolean);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    getRequestedNode(): ServerNode;
    get isReadRequest(): boolean;
}
