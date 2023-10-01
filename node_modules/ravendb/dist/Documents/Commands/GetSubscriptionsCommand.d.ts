import { RavenCommand } from "../../Http/RavenCommand";
import { SubscriptionState } from "../Subscriptions/SubscriptionState";
import { HttpRequestParameters } from "../../Primitives/Http";
import * as stream from "readable-stream";
import { ServerNode } from "../../Http/ServerNode";
export declare class GetSubscriptionsCommand extends RavenCommand<SubscriptionState[]> {
    private readonly _start;
    private readonly _pageSize;
    constructor(start: number, pageSize: number);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
