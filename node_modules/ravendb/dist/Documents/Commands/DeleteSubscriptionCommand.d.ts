import { RavenCommand } from "../../Http/RavenCommand";
import { HttpRequestParameters } from "../../Primitives/Http";
import { ServerNode } from "../../Http/ServerNode";
import { IRaftCommand } from "../../Http/IRaftCommand";
export declare class DeleteSubscriptionCommand extends RavenCommand<void> implements IRaftCommand {
    private readonly _name;
    constructor(name: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    get isReadRequest(): boolean;
    getRaftUniqueRequestId(): string;
}
