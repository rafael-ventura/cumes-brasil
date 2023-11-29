import { HttpRequestParameters } from "../../../Primitives/Http";
import { IOperation, OperationResultType } from "../OperationAbstractions";
import { CompareExchangeResult } from "./CompareExchangeResult";
import { RavenCommand } from "../../../Http/RavenCommand";
import { IDocumentStore } from "../../IDocumentStore";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { HttpCache } from "../../../Http/HttpCache";
import { ServerNode } from "../../../Http/ServerNode";
import * as stream from "readable-stream";
import { IRaftCommand } from "../../../Http/IRaftCommand";
import { IMetadataDictionary } from "../../Session/IMetadataDictionary";
export declare class PutCompareExchangeValueOperation<T> implements IOperation<CompareExchangeResult<T>> {
    private readonly _key;
    private readonly _value;
    private readonly _index;
    private readonly _metadata;
    constructor(key: string, value: T, index: number);
    constructor(key: string, value: T, index: number, metadata: IMetadataDictionary);
    getCommand(store: IDocumentStore, conventions: DocumentConventions, cache: HttpCache): RavenCommand<CompareExchangeResult<T>>;
    get resultType(): OperationResultType;
}
export declare class PutCompareExchangeValueCommand<T> extends RavenCommand<CompareExchangeResult<T>> implements IRaftCommand {
    private readonly _key;
    private readonly _value;
    private readonly _index;
    private readonly _conventions;
    private readonly _metadata;
    constructor(key: string, value: T, index: number, metadata: IMetadataDictionary, conventions: DocumentConventions);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    getRaftUniqueRequestId(): string;
}
