import { IOperation, OperationResultType } from "../OperationAbstractions";
import { TimeSeriesStatistics } from "./TimeSeriesStatistics";
import { IDocumentStore } from "../../IDocumentStore";
import { HttpCache } from "../../../Http/HttpCache";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class GetTimeSeriesStatisticsOperation implements IOperation<TimeSeriesStatistics> {
    private readonly _documentId;
    constructor(documentId: string);
    get resultType(): OperationResultType;
    getCommand(store: IDocumentStore, conventions: DocumentConventions, httpCache: HttpCache): RavenCommand<TimeSeriesStatistics>;
}
