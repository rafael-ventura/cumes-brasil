import { GetLogsConfigurationResult } from "./GetLogsConfigurationResult";
import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class GetLogsConfigurationOperation implements IServerOperation<GetLogsConfigurationResult> {
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<GetLogsConfigurationResult>;
}
