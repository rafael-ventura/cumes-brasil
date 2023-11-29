import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { RefreshConfiguration } from "./RefreshConfiguration";
import { ConfigureRefreshOperationResult } from "./ConfigureRefreshOperationResult";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class ConfigureRefreshOperation implements IMaintenanceOperation<ConfigureRefreshOperationResult> {
    private readonly _configuration;
    constructor(configuration: RefreshConfiguration);
    getCommand(conventions: DocumentConventions): RavenCommand<ConfigureRefreshOperationResult>;
    get resultType(): OperationResultType;
}
