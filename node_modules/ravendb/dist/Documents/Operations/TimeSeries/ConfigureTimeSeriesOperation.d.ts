import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { ConfigureTimeSeriesOperationResult } from "./ConfigureTimeSeriesOperationResult";
import { TimeSeriesConfiguration } from "./TimeSeriesConfiguration";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class ConfigureTimeSeriesOperation implements IMaintenanceOperation<ConfigureTimeSeriesOperationResult> {
    private readonly _configuration;
    constructor(configuration: TimeSeriesConfiguration);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<ConfigureTimeSeriesOperationResult>;
}
