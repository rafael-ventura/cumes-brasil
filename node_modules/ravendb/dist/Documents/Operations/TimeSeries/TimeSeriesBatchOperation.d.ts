import { IOperation, OperationResultType } from "../OperationAbstractions";
import { TimeSeriesOperation } from "./TimeSeriesOperation";
import { IDocumentStore } from "../../IDocumentStore";
import { HttpCache } from "../../../Http/HttpCache";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class TimeSeriesBatchOperation implements IOperation<void> {
    private readonly _documentId;
    private readonly _operation;
    get resultType(): OperationResultType;
    constructor(documentId: string, operation: TimeSeriesOperation);
    getCommand(store: IDocumentStore, conventions: DocumentConventions, httpCache: HttpCache): RavenCommand<void>;
}
