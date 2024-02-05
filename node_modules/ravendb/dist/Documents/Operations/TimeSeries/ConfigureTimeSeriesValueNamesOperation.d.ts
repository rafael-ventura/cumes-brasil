import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { ConfigureTimeSeriesOperationResult } from "./ConfigureTimeSeriesOperationResult";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class ConfigureTimeSeriesValueNamesOperation implements IMaintenanceOperation<ConfigureTimeSeriesOperationResult> {
    private readonly _parameters;
    constructor(parameters: ConfigureTimeSeriesValueNamesParameters);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<ConfigureTimeSeriesOperationResult>;
}
export interface ConfigureTimeSeriesValueNamesParameters {
    collection: string;
    timeSeries: string;
    valueNames: string[];
    update?: boolean;
}
