import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { ReplicationHubAccess } from "./ReplicationHubAccess";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class RegisterReplicationHubAccessOperation implements IMaintenanceOperation<void> {
    private readonly _hubName;
    private readonly _access;
    constructor(hubName: string, access: ReplicationHubAccess);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
