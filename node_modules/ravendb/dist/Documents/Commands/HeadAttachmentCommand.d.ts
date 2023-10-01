import { RavenCommand, ResponseDisposeHandling } from "./../../Http/RavenCommand";
import { HttpCache } from "./../../Http/HttpCache";
import { HttpRequestParameters, HttpResponse } from "./../../Primitives/Http";
import { ServerNode } from "../../Http/ServerNode";
import * as stream from "readable-stream";
export declare class HeadAttachmentCommand extends RavenCommand<string> {
    private readonly _documentId;
    private readonly _name;
    private readonly _changeVector;
    get isReadRequest(): boolean;
    constructor(documentId: string, name: string, changeVector: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    processResponse(cache: HttpCache, response: HttpResponse, bodyStream: stream.Readable, url: string): Promise<ResponseDisposeHandling>;
}
