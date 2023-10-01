import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
import { ServerNode } from "../../../Http/ServerNode";
export declare class GetTermsOperation implements IMaintenanceOperation<string[]> {
    private readonly _indexName;
    private readonly _field;
    private readonly _fromValue;
    private readonly _pageSize;
    constructor(indexName: string, field: string, fromValue: string);
    constructor(indexName: string, field: string, fromValue: string, pageSize: number);
    getCommand(conventions: DocumentConventions): RavenCommand<string[]>;
    get resultType(): OperationResultType;
}
export declare class GetTermsCommand extends RavenCommand<string[]> {
    private readonly _indexName;
    private readonly _field;
    private readonly _fromValue;
    private readonly _pageSize;
    constructor(indexName: string, field: string, fromValue: string);
    constructor(indexName: string, field: string, fromValue: string, pageSize: number);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
export interface TermsQueryResult {
    terms: string[];
    resultEtag: number;
    indexName: string;
}
