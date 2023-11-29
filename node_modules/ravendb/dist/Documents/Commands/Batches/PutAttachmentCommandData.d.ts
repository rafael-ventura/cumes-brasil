import { ICommandData, CommandType } from "../CommandData";
import { AttachmentData } from "./../../Attachments/index";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class PutAttachmentCommandData implements ICommandData {
    id: string;
    name: string;
    changeVector: string;
    type: CommandType;
    contentType: string;
    attStream: AttachmentData;
    constructor(documentId: string, name: string, stream: AttachmentData, contentType: string, changeVector: string);
    serialize(conventions: DocumentConventions): object;
}
