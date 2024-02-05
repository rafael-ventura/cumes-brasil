import { RavenCommand } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters } from "../../Primitives/Http";
export declare class KillOperationCommand extends RavenCommand<void> {
    private readonly _id;
    constructor(id: number);
    constructor(id: number, nodeTag: string);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
}
