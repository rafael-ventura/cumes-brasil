import { HttpRequestParameters } from "../../Primitives/Http";
import { IOperation, OperationIdResult, OperationResultType } from "./OperationAbstractions";
import { IndexQuery } from "../Queries/IndexQuery";
import { QueryOperationOptions } from "../Queries/QueryOperationOptions";
import { IDocumentStore } from "../IDocumentStore";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { HttpCache } from "../../Http/HttpCache";
import { RavenCommand } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import * as stream from "readable-stream";
export declare class PatchByQueryOperation implements IOperation<OperationIdResult> {
    protected static DUMMY_QUERY: IndexQuery;
    private readonly _queryToUpdate;
    private readonly _options;
    constructor(queryToUpdate: IndexQuery);
    constructor(queryToUpdate: string);
    constructor(queryToUpdate: IndexQuery, options?: QueryOperationOptions);
    getCommand(store: IDocumentStore, conventions: DocumentConventions, cache: HttpCache): RavenCommand<OperationIdResult>;
    get resultType(): OperationResultType;
}
export declare class PatchByQueryCommand extends RavenCommand<OperationIdResult> {
    private readonly _conventions;
    private readonly _queryToUpdate;
    private _options;
    get isReadRequest(): boolean;
    constructor(conventions: DocumentConventions, queryToUpdate: IndexQuery, options: QueryOperationOptions);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
