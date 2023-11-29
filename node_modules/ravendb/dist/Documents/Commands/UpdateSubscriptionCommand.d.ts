import { HttpRequestParameters } from "../../Primitives/Http";
import * as stream from "readable-stream";
import { UpdateSubscriptionResult } from "../Subscriptions/UpdateSubscriptionResult";
import { SubscriptionUpdateOptions } from "../Subscriptions/SubscriptionUpdateOptions";
import { RavenCommand } from "../../Http/RavenCommand";
import { IRaftCommand } from "../../Http/IRaftCommand";
import { ServerNode } from "../../Http/ServerNode";
export declare class UpdateSubscriptionCommand extends RavenCommand<UpdateSubscriptionResult> implements IRaftCommand {
    private readonly _options;
    constructor(options: SubscriptionUpdateOptions);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseFromCache(cachedValue: string): Promise<void>;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
    getRaftUniqueRequestId(): string;
}
