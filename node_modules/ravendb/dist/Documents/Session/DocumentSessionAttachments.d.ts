import { DocumentSessionAttachmentsBase } from "./DocumentSessionAttachmentsBase";
import { IAttachmentsSessionOperations } from "./IAttachmentsSessionOperations";
import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
import { AttachmentResult } from "../Attachments";
export declare class DocumentSessionAttachments extends DocumentSessionAttachmentsBase implements IAttachmentsSessionOperations {
    constructor(session: InMemoryDocumentSessionOperations);
    exists(documentId: string, name: string): Promise<boolean>;
    get(entity: object, name: string): Promise<AttachmentResult>;
    get(documentId: string, name: string): Promise<AttachmentResult>;
    getRevision(documentId: string, name: string, changeVector: string): Promise<AttachmentResult>;
}
