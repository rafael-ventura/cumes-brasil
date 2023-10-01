import { IOperation, OperationResultType } from "../OperationAbstractions";
import { CountersDetail } from "../Counters/CountersDetail";
import { IDocumentStore } from "../../IDocumentStore";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { HttpCache } from "../../../Http/HttpCache";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
export declare class GetCountersOperation implements IOperation<CountersDetail> {
    private readonly _docId;
    private readonly _counters;
    private readonly _returnFullResults;
    constructor(docId: string);
    constructor(docId: string, counters: string[]);
    constructor(docId: string, counters: string[], returnFullResults: boolean);
    constructor(docId: string, counter: string);
    constructor(docId: string, counter: string, returnFullResults: boolean);
    getCommand(store: IDocumentStore, conventions: DocumentConventions, cache: HttpCache): RavenCommand<CountersDetail>;
    get resultType(): OperationResultType;
}
export declare class GetCounterValuesCommand extends RavenCommand<CountersDetail> {
    private readonly _docId;
    private readonly _counters;
    private readonly _returnFullResults;
    private readonly _conventions;
    constructor(docId: string, counters: string[], returnFullResults: boolean, conventions: DocumentConventions);
    createRequest(node: ServerNode): HttpRequestParameters;
    private _prepareRequestWithMultipleCounters;
    private _getOrderedUniqueNames;
    get isReadRequest(): boolean;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
