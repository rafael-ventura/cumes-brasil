import { ConnectionString } from "./ConnectionString";
import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { EtlConfiguration } from "./EtlConfiguration";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class UpdateEtlOperation<T extends ConnectionString> implements IMaintenanceOperation<UpdateEtlOperationResult> {
    private readonly _taskId;
    private readonly _configuration;
    constructor(taskId: number, configuration: EtlConfiguration<T>);
    getCommand(conventions: DocumentConventions): RavenCommand<UpdateEtlOperationResult>;
    get resultType(): OperationResultType;
}
interface UpdateEtlOperationResult {
    raftCommandIndex: number;
    taskId: number;
}
export {};
