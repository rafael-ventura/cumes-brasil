import * as stream from "readable-stream";
import { InMemoryDocumentSessionOperations } from "../InMemoryDocumentSessionOperations";
import { QueryStreamCommand } from "../../Commands/QueryStreamCommand";
import { IndexQuery } from "../../Queries/IndexQuery";
import { StartingWithOptions } from "../IDocumentSession";
import { StreamCommand } from "../../Commands/StreamCommand";
import { StreamResultResponse } from "../../Commands/StreamResultResponse";
export declare class StreamOperation {
    private readonly _session;
    private _isQueryStream;
    constructor(session: InMemoryDocumentSessionOperations);
    createRequest(query: IndexQuery): QueryStreamCommand;
    createRequest(idPrefix: string, opts: StartingWithOptions): StreamCommand;
    private _createRequestForQuery;
    private _createRequestForIdPrefix;
    setResult(response: StreamResultResponse): stream.Readable;
}
