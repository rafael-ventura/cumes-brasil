import { RavenCommand } from "../../../Http/RavenCommand";
import { IRaftCommand } from "../../../Http/IRaftCommand";
import { ServerNode } from "../../../Http/ServerNode";
import { HttpRequestParameters } from "../../../Primitives/Http";
export declare class AddClusterNodeCommand extends RavenCommand<void> implements IRaftCommand {
    private readonly _url;
    private readonly _tag;
    private readonly _watcher;
    constructor(url: string, tag?: string, watcher?: boolean);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    getRaftUniqueRequestId(): string;
}
