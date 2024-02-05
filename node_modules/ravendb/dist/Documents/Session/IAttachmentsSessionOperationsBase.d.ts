import { AttachmentName } from "../Attachments";
import { AttachmentData } from "./../Attachments";
export interface IAttachmentsSessionOperationsBase {
    getNames(entity: object): AttachmentName[];
    store(documentId: string, name: string, stream: AttachmentData): void;
    store(documentId: string, name: string, stream: AttachmentData, contentType: string): void;
    store(entity: object, name: string, stream: AttachmentData): void;
    store(entity: object, name: string, stream: AttachmentData, contentType: string): void;
    delete(documentId: string, name: string): void;
    delete(entity: object, name: string): void;
    rename(documentId: string, name: string, newName: string): void;
    rename(entity: object, name: string, newName: string): void;
    move(sourceEntity: object, sourceName: string, destinationEntity: object, destinationName: string): void;
    move(sourceDocumentId: string, sourceName: string, destinationDocumentId: string, destinationName: string): void;
    copy(sourceDocumentId: string, sourceName: string, destinationDocumentId: string, destinationName: string): void;
    copy(sourceEntity: object, sourceName: string, destinationEntity: object, destinationName: string): void;
}
