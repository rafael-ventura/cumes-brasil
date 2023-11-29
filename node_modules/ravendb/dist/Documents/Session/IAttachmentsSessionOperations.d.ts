import { AttachmentResult } from "../Attachments";
import { IAttachmentsSessionOperationsBase } from "./IAttachmentsSessionOperationsBase";
export interface IAttachmentsSessionOperations extends IAttachmentsSessionOperationsBase {
    exists(documentId: string, name: string): Promise<boolean>;
    get(documentId: string, name: string): Promise<AttachmentResult | null>;
    get(entity: object, name: string): Promise<AttachmentResult | null>;
    getRevision(documentId: string, name: string, changeVector: string): Promise<AttachmentResult | null>;
}
