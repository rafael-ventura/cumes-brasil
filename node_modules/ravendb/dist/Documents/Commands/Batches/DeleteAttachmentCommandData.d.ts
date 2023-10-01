import { ICommandData, CommandType } from "../CommandData";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class DeleteAttachmentCommandData implements ICommandData {
    id: string;
    name: string;
    changeVector: string;
    type: CommandType;
    constructor(documentId: string, name: string, changeVector: string);
    serialize(conventions: DocumentConventions): object;
}
