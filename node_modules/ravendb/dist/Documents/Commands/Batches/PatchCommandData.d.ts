import { CommandType, ICommandData } from "../CommandData";
import { PatchRequest } from "../../Operations/PatchRequest";
import { InMemoryDocumentSessionOperations } from "../../Session/InMemoryDocumentSessionOperations";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class PatchCommandData implements ICommandData {
    id: string;
    name: string;
    createIfMissing: any;
    changeVector: string;
    patch: PatchRequest;
    patchIfMissing: PatchRequest;
    type: CommandType;
    returnDocument: boolean;
    constructor(id: string, changeVector: string, patch: PatchRequest, patchIfMissing?: PatchRequest);
    serialize(conventions: DocumentConventions): object;
    onBeforeSaveChanges(session: InMemoryDocumentSessionOperations): void;
}
