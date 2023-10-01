import { LogMode } from "./LogMode";
import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class SetLogsConfigurationOperation implements IServerOperation<void> {
    private readonly _parameters;
    constructor(parameters: SetLogsConfigurationParameters);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
export interface SetLogsConfigurationParameters {
    mode: LogMode;
    retentionTime?: string;
    retentionSize?: number;
    compress?: boolean;
}
