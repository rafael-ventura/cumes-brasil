import { HttpRequestParameters } from "../../../Primitives/Http";
import { IOperation, OperationResultType } from "../OperationAbstractions";
import { CompareExchangeValue } from "./CompareExchangeValue";
import { RavenCommand } from "../../../Http/RavenCommand";
import { HttpCache } from "../../../Http/HttpCache";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { IDocumentStore } from "../../IDocumentStore";
import { ServerNode } from "../../../Http/ServerNode";
import { CompareExchangeResultClass } from "../../../Types";
import * as stream from "readable-stream";
export declare class GetCompareExchangeValueOperation<T> implements IOperation<CompareExchangeValue<T>> {
    private readonly _key;
    private readonly _materializeMetadata;
    private readonly _clazz;
    constructor(key: string, clazz?: CompareExchangeResultClass<T>, materializeMetadata?: boolean);
    getCommand(store: IDocumentStore, conventions: DocumentConventions, cache: HttpCache): RavenCommand<CompareExchangeValue<T>>;
    get resultType(): OperationResultType;
}
export declare class GetCompareExchangeValueCommand<T> extends RavenCommand<CompareExchangeValue<T>> {
    private readonly _key;
    private readonly _clazz;
    private readonly _materializeMetadata;
    private readonly _conventions;
    constructor(key: string, materializeMetadata: boolean, conventions: DocumentConventions, clazz?: CompareExchangeResultClass<T>);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
