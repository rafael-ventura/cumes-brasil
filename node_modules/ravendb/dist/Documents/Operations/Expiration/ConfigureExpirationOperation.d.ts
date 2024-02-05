import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { ExpirationConfiguration } from "./ExpirationConfiguration";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class ConfigureExpirationOperation implements IMaintenanceOperation<ConfigureExpirationOperationResult> {
    private readonly _configuration;
    constructor(configuration: ExpirationConfiguration);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<ConfigureExpirationOperationResult>;
}
export interface ConfigureExpirationOperationResult {
    raftCommandIndex: number;
}
