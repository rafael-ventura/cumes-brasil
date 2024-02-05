import { RavenCommand } from "../../Http/RavenCommand";
import { HttpRequestParameters } from "../../Primitives/Http";
import { ServerNode } from "../../Http/ServerNode";
import * as stream from "readable-stream";
import { IRaftCommand } from "../../Http/IRaftCommand";
export declare class SeedIdentityForCommand extends RavenCommand<number> implements IRaftCommand {
    private readonly _id;
    private readonly _value;
    private readonly _forced;
    constructor(id: string, value: number, forced?: boolean);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    getRaftUniqueRequestId(): string;
}
