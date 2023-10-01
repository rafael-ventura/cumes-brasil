import { RavenCommand } from "../../Http/RavenCommand";
import { ClusterTopology } from "../../Http/ClusterTopology";
import { HttpRequestParameters } from "../../Primitives/Http";
import { ServerNode } from "../../Http/ServerNode";
import * as stream from "readable-stream";
import { NodeStatus } from "../../Http/RequestExecutor";
export declare class ClusterTopologyResponse {
    leader: string;
    nodeTag: string;
    topology: ClusterTopology;
    etag: number;
    status: Map<string, NodeStatus>;
}
export declare class GetClusterTopologyCommand extends RavenCommand<ClusterTopologyResponse> {
    private readonly _debugTag;
    constructor(debugTag?: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
