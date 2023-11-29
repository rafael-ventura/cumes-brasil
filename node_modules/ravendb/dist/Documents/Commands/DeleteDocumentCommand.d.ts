import { HttpRequestParameters } from "../../Primitives/Http";
import { RavenCommand } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
export declare class DeleteDocumentCommand extends RavenCommand<void> {
    private readonly _id;
    private readonly _changeVector;
    constructor(id: string);
    constructor(id: string, changeVector: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    get isReadRequest(): boolean;
}
