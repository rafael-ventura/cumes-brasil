import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { ModifyOngoingTaskResult } from "../../../ServerWide/ModifyOnGoingTaskResult";
import { PullReplicationAsSink } from "./PullReplicationAsSink";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class UpdatePullReplicationAsSinkOperation implements IMaintenanceOperation<ModifyOngoingTaskResult> {
    private readonly _pullReplication;
    constructor(pullReplication: PullReplicationAsSink);
    getCommand(conventions: DocumentConventions): RavenCommand<ModifyOngoingTaskResult>;
    get resultType(): OperationResultType;
}
