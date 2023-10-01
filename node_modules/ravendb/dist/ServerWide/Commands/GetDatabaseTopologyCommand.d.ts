import * as stream from "readable-stream";
import { RavenCommand } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import { Topology } from "../../Http/Topology";
import { HttpRequestParameters } from "../../Primitives/Http";
export declare class GetDatabaseTopologyCommand extends RavenCommand<Topology> {
    private readonly _applicationIdentifier;
    private readonly _debugTag;
    constructor(debugTag?: string, applicationIdentifier?: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
