import { HttpRequestParameters } from "../../Primitives/Http";
import { RavenCommand } from "../../Http/RavenCommand";
import { QueryResult } from "../Queries/QueryResult";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { IndexQuery } from "../Queries/IndexQuery";
import { ServerNode } from "../../Http/ServerNode";
import { JsonSerializer } from "../../Mapping/Json/Serializer";
import * as stream from "readable-stream";
import { InMemoryDocumentSessionOperations } from "../Session/InMemoryDocumentSessionOperations";
export interface QueryCommandOptions {
    metadataOnly?: boolean;
    indexEntriesOnly?: boolean;
}
export declare class QueryCommand extends RavenCommand<QueryResult> {
    protected _session: InMemoryDocumentSessionOperations;
    private readonly _indexQuery;
    private readonly _metadataOnly;
    private readonly _indexEntriesOnly;
    constructor(session: InMemoryDocumentSessionOperations, indexQuery: IndexQuery, opts: QueryCommandOptions);
    createRequest(node: ServerNode): HttpRequestParameters;
    protected get _serializer(): JsonSerializer;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
    static parseQueryResultResponseAsync(bodyStream: stream.Stream, conventions: DocumentConventions, fromCache: boolean, bodyCallback?: (body: string) => void): Promise<QueryResult>;
    private static _mapTimingsToLocalObject;
    private static _mapToLocalObject;
}
