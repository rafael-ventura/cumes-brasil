import * as stream from "readable-stream";
import { RavenCommand, ResponseDisposeHandling } from "../../Http/RavenCommand";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { IndexQuery } from "../Queries/IndexQuery";
import { StreamResultResponse } from "./StreamResultResponse";
import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters, HttpResponse } from "../../Primitives/Http";
import { HttpCache } from "../../Http/HttpCache";
export declare class QueryStreamCommand extends RavenCommand<StreamResultResponse> {
    private readonly _conventions;
    private readonly _indexQuery;
    constructor(conventions: DocumentConventions, query: IndexQuery);
    createRequest(node: ServerNode): HttpRequestParameters;
    processResponse(cache: HttpCache, response: HttpResponse, bodyStream: stream.Readable, url: string): Promise<ResponseDisposeHandling>;
    get isReadRequest(): boolean;
}
