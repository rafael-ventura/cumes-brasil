import { IOperation, OperationResultType } from "../OperationAbstractions";
import { HttpCache } from "../../../Http/HttpCache";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { IDocumentStore } from "../../IDocumentStore";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
export declare class DeleteAttachmentOperation implements IOperation<void> {
    private readonly _documentId;
    private readonly _name;
    private readonly _changeVector;
    get resultType(): OperationResultType;
    constructor(documentId: string, name: string, changeVector?: string);
    getCommand(store: IDocumentStore, conventions: DocumentConventions, httpCache: HttpCache): RavenCommand<void>;
}
export declare class DeleteAttachmentCommand extends RavenCommand<void> {
    private readonly _documentId;
    private readonly _name;
    private readonly _changeVector;
    constructor(documentId: string, name: string, changeVector: string);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
}
