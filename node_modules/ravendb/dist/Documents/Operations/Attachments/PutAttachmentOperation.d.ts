import { IOperation, OperationResultType } from "../OperationAbstractions";
import { AttachmentData, AttachmentDetails } from "../../Attachments";
import { IDocumentStore } from "../../IDocumentStore";
import { HttpCache } from "../../../Http/HttpCache";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
export declare class PutAttachmentOperation implements IOperation<AttachmentDetails> {
    private readonly _documentId;
    private readonly _name;
    private readonly _stream;
    private readonly _contentType;
    private readonly _changeVector;
    constructor(documentId: string, name: string, stream: AttachmentData);
    constructor(documentId: string, name: string, stream: AttachmentData, contentType: string);
    constructor(documentId: string, name: string, stream: AttachmentData, contentType: string, changeVector: string);
    getCommand(store: IDocumentStore, conventions: DocumentConventions, httpCache: HttpCache): RavenCommand<AttachmentDetails>;
    get resultType(): OperationResultType;
}
export declare class PutAttachmentCommand extends RavenCommand<AttachmentDetails> {
    private readonly _documentId;
    private readonly _name;
    private readonly _stream;
    private readonly _contentType;
    private readonly _changeVector;
    constructor(documentId: string, name: string, stream: AttachmentData, contentType: string, changeVector: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
