import { IMaintenanceOperation, OperationResultType } from "./OperationAbstractions";
import { DetailedCollectionStatistics } from "./DetailedCollectionStatistics";
import { RavenCommand } from "../../Http/RavenCommand";
import { DocumentConventions } from "../Conventions/DocumentConventions";
export declare class GetDetailedCollectionStatisticsOperation implements IMaintenanceOperation<DetailedCollectionStatistics> {
    getCommand(conventions: DocumentConventions): RavenCommand<DetailedCollectionStatistics>;
    get resultType(): OperationResultType;
}
