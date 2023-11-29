import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { OngoingTaskType } from "./OngoingTaskType";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ModifyOngoingTaskResult } from "../../../ServerWide/ModifyOnGoingTaskResult";
export declare class ToggleOngoingTaskStateOperation implements IMaintenanceOperation<ModifyOngoingTaskResult> {
    private readonly _taskId;
    private readonly _taskName;
    private readonly _type;
    private readonly _disable;
    constructor(taskId: number, type: OngoingTaskType, disable: boolean);
    constructor(taskName: string, type: OngoingTaskType, disable: boolean);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<ModifyOngoingTaskResult>;
}
