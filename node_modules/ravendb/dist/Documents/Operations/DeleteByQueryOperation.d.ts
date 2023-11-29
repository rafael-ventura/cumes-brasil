import { HttpRequestParameters } from "../../Primitives/Http";
import { IOperation, OperationIdResult, OperationResultType } from "./OperationAbstractions";
import { IndexQuery } from "../Queries/IndexQuery";
import { HttpCache } from "../../Http/HttpCache";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { IDocumentStore } from "../IDocumentStore";
import { RavenCommand } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import { QueryOperationOptions } from "../Queries/QueryOperationOptions";
import * as stream from "readable-stream";
export declare class DeleteByQueryOperation implements IOperation<OperationIdResult> {
    get resultType(): OperationResultType;
    protected _queryToDelete: IndexQuery;
    private readonly _options;
    constructor(queryToDelete: string);
    constructor(queryToDelete: IndexQuery);
    constructor(queryToDelete: IndexQuery, options: QueryOperationOptions);
    getCommand(store: IDocumentStore, conventions: DocumentConventions, cache: HttpCache): RavenCommand<OperationIdResult>;
}
export declare class DeleteByIndexCommand extends RavenCommand<OperationIdResult> {
    private readonly _conventions;
    private readonly _queryToDelete;
    private _options;
    constructor(conventions: DocumentConventions, queryToDelete: IndexQuery, options: QueryOperationOptions);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
