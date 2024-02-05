import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { OngoingTaskType } from "../../../Documents/Operations/OngoingTasks/OngoingTaskType";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
export declare class ToggleServerWideTaskStateOperation implements IServerOperation<void> {
    private readonly _name;
    private readonly _type;
    private readonly _disable;
    constructor(name: string, type: OngoingTaskType, disable: boolean);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
