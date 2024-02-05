import { RavenCommand } from "../../Http/RavenCommand";
import { SubscriptionState } from "../Subscriptions/SubscriptionState";
import { HttpRequestParameters } from "../../Primitives/Http";
import * as stream from "readable-stream";
import { ServerNode } from "../../Http/ServerNode";
export declare class GetSubscriptionStateCommand extends RavenCommand<SubscriptionState> {
    private readonly _subscriptionName;
    constructor(subscriptionName: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
