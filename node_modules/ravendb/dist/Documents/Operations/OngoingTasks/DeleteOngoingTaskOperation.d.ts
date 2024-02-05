import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { OngoingTaskType } from "./OngoingTaskType";
import { ModifyOngoingTaskResult } from "../../../ServerWide/ModifyOnGoingTaskResult";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class DeleteOngoingTaskOperation implements IMaintenanceOperation<ModifyOngoingTaskResult> {
    private readonly _taskId;
    private readonly _taskType;
    constructor(taskId: number, taskType: OngoingTaskType);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<ModifyOngoingTaskResult>;
}
