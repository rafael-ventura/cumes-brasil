import { IOperation, OperationResultType } from "../OperationAbstractions";
import { HttpRequestParameters, HttpResponse } from "./../../../Primitives/Http";
import { AttachmentResult, AttachmentType } from "../../Attachments";
import { RavenCommand, ResponseDisposeHandling } from "../../../Http/RavenCommand";
import { HttpCache } from "../../../Http/HttpCache";
import { IDocumentStore } from "../../IDocumentStore";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { ServerNode } from "../../../Http/ServerNode";
import * as stream from "readable-stream";
export declare class GetAttachmentOperation implements IOperation<AttachmentResult> {
    private readonly _documentId;
    private readonly _name;
    private readonly _type;
    private readonly _changeVector;
    get resultType(): OperationResultType;
    constructor(documentId: string, name: string, type: AttachmentType, changeVector: string);
    getCommand(store: IDocumentStore, conventions: DocumentConventions, cache: HttpCache): RavenCommand<AttachmentResult>;
}
export declare class GetAttachmentCommand extends RavenCommand<AttachmentResult> {
    private readonly _documentId;
    private readonly _name;
    private readonly _type;
    private readonly _changeVector;
    constructor(documentId: string, name: string, type: AttachmentType, changeVector: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    processResponse(cache: HttpCache, response: HttpResponse, bodyStream: stream.Readable, url: string): Promise<ResponseDisposeHandling>;
    get isReadRequest(): boolean;
}
