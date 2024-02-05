export declare class AttachmentRequest {
    private readonly _name;
    private readonly _documentId;
    constructor(documentId: string, name: string);
    get name(): string;
    get documentId(): string;
}
