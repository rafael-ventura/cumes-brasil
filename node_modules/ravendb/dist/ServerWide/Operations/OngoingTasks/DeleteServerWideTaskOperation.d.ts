import { IServerOperation, OperationResultType } from "../../../Documents/Operations/OperationAbstractions";
import { OngoingTaskType } from "../../../Documents/Operations/OngoingTasks/OngoingTaskType";
import { DocumentConventions } from "../../../Documents/Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class DeleteServerWideTaskOperation implements IServerOperation<void> {
    private readonly _name;
    private readonly _type;
    constructor(name: string, type: OngoingTaskType);
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
