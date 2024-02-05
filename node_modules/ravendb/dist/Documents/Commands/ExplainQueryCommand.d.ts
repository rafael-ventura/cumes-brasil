import { HttpRequestParameters } from "../../Primitives/Http";
import { RavenCommand } from "../../Http/RavenCommand";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { IndexQuery } from "../Queries/IndexQuery";
import { ServerNode } from "../../Http/ServerNode";
import * as stream from "readable-stream";
export interface ExplainQueryResult {
    index: string;
    reason: string;
}
export declare class ExplainQueryCommand extends RavenCommand<ExplainQueryResult[]> {
    private readonly _conventions;
    private readonly _indexQuery;
    constructor(conventions: DocumentConventions, indexQuery: IndexQuery);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
