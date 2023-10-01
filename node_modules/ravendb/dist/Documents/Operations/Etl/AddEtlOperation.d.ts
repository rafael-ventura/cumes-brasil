import { ConnectionString } from "./ConnectionString";
import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { EtlConfiguration } from "./EtlConfiguration";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class AddEtlOperation<T extends ConnectionString> implements IMaintenanceOperation<AddEtlOperationResult> {
    private readonly _configuration;
    constructor(configuration: EtlConfiguration<T>);
    getCommand(conventions: DocumentConventions): RavenCommand<AddEtlOperationResult>;
    get resultType(): OperationResultType;
}
export interface AddEtlOperationResult {
    raftCommandIndex: number;
    taskId: number;
}
