import { RavenCommand, ResponseDisposeHandling } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters, HttpResponse } from "../../Primitives/Http";
import * as stream from "readable-stream";
import { HttpCache } from "../../Http/HttpCache";
import { DocumentConventions } from "../Conventions/DocumentConventions";
export declare class ConditionalGetDocumentsCommand extends RavenCommand<ConditionalGetResult> {
    private readonly _changeVector;
    private readonly _id;
    private readonly _conventions;
    constructor(id: string, changeVector: string, conventions: DocumentConventions);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    static parseDocumentsResultResponseAsync(bodyStream: stream.Stream, conventions: DocumentConventions, bodyCallback?: (body: string) => void): Promise<ConditionalGetResult>;
    private static _mapToLocalObject;
    processResponse(cache: HttpCache, response: HttpResponse, bodyStream: stream.Readable, url: string): Promise<ResponseDisposeHandling>;
    get isReadRequest(): boolean;
}
export interface ConditionalGetResult {
    results: any[];
    changeVector: string;
}
