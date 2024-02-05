import { IOperation, OperationResultType } from "../OperationAbstractions";
import { RevisionsResult } from "./RevisionsResult";
import { DocumentType } from "../../DocumentAbstractions";
import { IDocumentStore } from "../../IDocumentStore";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { HttpCache } from "../../../Http/HttpCache";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class GetRevisionsOperation<T extends object> implements IOperation<RevisionsResult<T>> {
    private readonly _parameters;
    private readonly _id;
    constructor(id: string, parameters?: GetRevisionsParameters<T>);
    get resultType(): OperationResultType;
    getCommand(store: IDocumentStore, conventions: DocumentConventions, httpCache: HttpCache): RavenCommand<RevisionsResult<T>>;
}
export interface GetRevisionsParameters<T extends object> {
    documentType?: DocumentType<T>;
    start?: number;
    pageSize?: number;
}
