import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { ConfigureTimeSeriesOperationResult } from "./ConfigureTimeSeriesOperationResult";
import { TimeSeriesPolicy } from "./TimeSeriesPolicy";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class ConfigureTimeSeriesPolicyOperation implements IMaintenanceOperation<ConfigureTimeSeriesOperationResult> {
    private readonly _collection;
    private readonly _config;
    constructor(collection: string, config: TimeSeriesPolicy);
    getCommand(conventions: DocumentConventions): RavenCommand<ConfigureTimeSeriesOperationResult>;
    get resultType(): OperationResultType;
}
