import { RavenCommand } from "../../Http/RavenCommand";
import { CreateSubscriptionResult } from "../Subscriptions/CreateSubscriptionResult";
import { SubscriptionCreationOptions } from "../Subscriptions/SubscriptionCreationOptions";
import { HttpRequestParameters } from "../../Primitives/Http";
import * as stream from "readable-stream";
import { ServerNode } from "../../Http/ServerNode";
import { IRaftCommand } from "../../Http/IRaftCommand";
export declare class CreateSubscriptionCommand extends RavenCommand<CreateSubscriptionResult> implements IRaftCommand {
    private readonly _options;
    private readonly _id;
    constructor(options: SubscriptionCreationOptions, id?: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
    getRaftUniqueRequestId(): string;
}
