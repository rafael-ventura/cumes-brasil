import { RavenCommand } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters } from "../../Primitives/Http";
import * as stream from "readable-stream";
import { JsonSerializer } from "../../Mapping/Json/Serializer";
export interface PutResult {
    id: string;
    changeVector: string;
}
export declare class PutDocumentCommand extends RavenCommand<PutResult> {
    private readonly _id;
    private readonly _changeVector;
    private readonly _document;
    constructor(id: string, changeVector: string, document: object);
    protected get _serializer(): JsonSerializer;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
