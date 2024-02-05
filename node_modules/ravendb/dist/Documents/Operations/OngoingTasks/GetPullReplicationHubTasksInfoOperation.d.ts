import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { PullReplicationDefinitionAndCurrentConnections } from "../Replication/PullReplicationDefinitionAndCurrentConnections";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class GetPullReplicationHubTasksInfoOperation implements IMaintenanceOperation<PullReplicationDefinitionAndCurrentConnections> {
    private readonly _taskId;
    constructor(taskId: number);
    getCommand(conventions: DocumentConventions): RavenCommand<PullReplicationDefinitionAndCurrentConnections>;
    get resultType(): OperationResultType;
}
