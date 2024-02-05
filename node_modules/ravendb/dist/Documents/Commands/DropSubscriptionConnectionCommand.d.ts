import { RavenCommand } from "../../Http/RavenCommand";
import { HttpRequestParameters } from "../../Primitives/Http";
import { ServerNode } from "../../Http/ServerNode";
export declare class DropSubscriptionConnectionCommand extends RavenCommand<void> {
    private readonly _name;
    constructor(name: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    get isReadRequest(): boolean;
}
