import { RavenCommand } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters } from "../../Primitives/Http";
import * as stream from "readable-stream";
import { IRaftCommand } from "../../Http/IRaftCommand";
import { IBroadcast } from "../../Http/IBroadcast";
import { DocumentConventions } from "../Conventions/DocumentConventions";
export declare class NextIdentityForCommand extends RavenCommand<number> implements IRaftCommand, IBroadcast {
    private readonly _id;
    private _raftUniqueRequestId;
    constructor(id: string);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    getRaftUniqueRequestId(): string;
    prepareToBroadcast(conventions: DocumentConventions): IBroadcast;
}
