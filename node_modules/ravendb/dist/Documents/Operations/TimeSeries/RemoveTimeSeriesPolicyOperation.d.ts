import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { ConfigureTimeSeriesOperationResult } from "./ConfigureTimeSeriesOperationResult";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class RemoveTimeSeriesPolicyOperation implements IMaintenanceOperation<ConfigureTimeSeriesOperationResult> {
    private readonly _collection;
    private readonly _name;
    constructor(collection: string, name: string);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<ConfigureTimeSeriesOperationResult>;
}
