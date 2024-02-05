import * as stream from "readable-stream";
import { RavenCommand, ResponseDisposeHandling } from "../../Http/RavenCommand";
import { StreamResultResponse } from "./StreamResultResponse";
import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters, HttpResponse } from "../../Primitives/Http";
import { HttpCache } from "../../Http/HttpCache";
export declare class StreamCommand extends RavenCommand<StreamResultResponse> {
    private readonly _url;
    constructor(url: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    processResponse(cache: HttpCache, response: HttpResponse, bodyStream: stream.Readable, url: string): Promise<ResponseDisposeHandling>;
    get isReadRequest(): boolean;
}
