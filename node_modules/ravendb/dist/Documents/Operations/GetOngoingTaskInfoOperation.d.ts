import { IMaintenanceOperation, OperationResultType } from "./OperationAbstractions";
import { OngoingTask } from "./OngoingTasks/OngoingTask";
import { OngoingTaskType } from "./OngoingTasks/OngoingTaskType";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { RavenCommand } from "../../Http/RavenCommand";
export declare class GetOngoingTaskInfoOperation implements IMaintenanceOperation<OngoingTask> {
    private readonly _taskName;
    private readonly _taskId;
    private readonly _type;
    constructor(taskId: number, type: OngoingTaskType);
    constructor(taskName: string, type: OngoingTaskType);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<OngoingTask>;
}
