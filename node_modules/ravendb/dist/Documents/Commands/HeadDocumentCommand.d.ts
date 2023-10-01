import { HttpRequestParameters, HttpResponse } from "../../Primitives/Http";
import { ResponseDisposeHandling, RavenCommand } from "../../Http/RavenCommand";
import { HttpCache } from "../../Http/HttpCache";
import { ServerNode } from "../../Http/ServerNode";
import * as stream from "readable-stream";
export declare class HeadDocumentCommand extends RavenCommand<string> {
    private readonly _id;
    private readonly _changeVector;
    constructor(id: string, changeVector: string);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    processResponse(cache: HttpCache, response: HttpResponse, bodyStream: stream.Readable, url: string): Promise<ResponseDisposeHandling>;
}
