import { IOperation, OperationResultType } from "../OperationAbstractions";
import { CountersDetail } from "./CountersDetail";
import { CounterBatch } from "./CounterBatch";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { IDocumentStore } from "../../IDocumentStore";
import { HttpCache } from "../../../Http/HttpCache";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
export declare class CounterBatchOperation implements IOperation<CountersDetail> {
    get resultType(): OperationResultType;
    private readonly _counterBatch;
    constructor(counterBatch: CounterBatch);
    getCommand(store: IDocumentStore, conventions: DocumentConventions, cache: HttpCache): RavenCommand<CountersDetail>;
}
export declare class CounterBatchCommand extends RavenCommand<CountersDetail> {
    private readonly _counterBatch;
    constructor(counterBatch: CounterBatch);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
