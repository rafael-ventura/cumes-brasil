import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class UnregisterReplicationHubAccessOperation implements IMaintenanceOperation<void> {
    private readonly _hubName;
    private readonly _thumbprint;
    constructor(hubName: string, thumbprint: string);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
