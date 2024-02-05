import { ICommandData, CommandType } from "../CommandData";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class MoveAttachmentCommandData implements ICommandData {
    id: string;
    changeVector: string;
    name: string;
    private _destinationId;
    private _destinationName;
    get type(): CommandType;
    constructor(documentId: string, name: string, destinationDocumentId: string, destinationName: string, changeVector: string);
    getType(): CommandType;
    serialize(conventions: DocumentConventions): object;
}
