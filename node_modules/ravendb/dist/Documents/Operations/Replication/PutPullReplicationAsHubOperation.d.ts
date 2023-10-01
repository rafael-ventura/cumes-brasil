import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { PullReplicationDefinition } from "./PullReplicationDefinition";
import { ModifyOngoingTaskResult } from "../../../ServerWide/ModifyOnGoingTaskResult";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class PutPullReplicationAsHubOperation implements IMaintenanceOperation<ModifyOngoingTaskResult> {
    private readonly _pullReplicationDefinition;
    constructor(name: string);
    constructor(pullReplicationDefinition: PullReplicationDefinition);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<ModifyOngoingTaskResult>;
}
