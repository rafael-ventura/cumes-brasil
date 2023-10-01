import { HttpRequestParameters } from "../../../Primitives/Http";
import { IOperation, OperationResultType } from "../OperationAbstractions";
import { CompareExchangeResult } from "./CompareExchangeResult";
import { CompareExchangeResultClass } from "../../../Types";
import { IDocumentStore } from "../../IDocumentStore";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { HttpCache } from "../../../Http/HttpCache";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
import * as stream from "readable-stream";
import { IRaftCommand } from "../../../Http/IRaftCommand";
export declare class DeleteCompareExchangeValueOperation<T> implements IOperation<CompareExchangeResult<T>> {
    private readonly _key;
    private readonly _index;
    private readonly _clazz;
    constructor(key: string, index: number, clazz?: CompareExchangeResultClass<T>);
    getCommand(store: IDocumentStore, conventions: DocumentConventions, cache: HttpCache): RavenCommand<CompareExchangeResult<T>>;
    get resultType(): OperationResultType;
}
export declare class RemoveCompareExchangeCommand<T> extends RavenCommand<CompareExchangeResult<T>> implements IRaftCommand {
    private readonly _key;
    private readonly _index;
    private readonly _clazz;
    private readonly _conventions;
    constructor(key: string, index: number, conventions: DocumentConventions, clazz?: CompareExchangeResultClass<T>);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    getRaftUniqueRequestId(): string;
}
