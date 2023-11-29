import { ServerNode } from "../../../Http/ServerNode";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class HiloReturnCommand extends RavenCommand<void> {
    get isReadRequest(): boolean;
    private readonly _tag;
    private readonly _last;
    private readonly _end;
    constructor(tag: string, last: number, end: number);
    createRequest(node: ServerNode): HttpRequestParameters;
}
