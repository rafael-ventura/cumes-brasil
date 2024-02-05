import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
export declare class ResetEtlOperation implements IMaintenanceOperation<void> {
    private readonly _configurationName;
    private readonly _transformationName;
    constructor(configurationName: string, transformationName: string);
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
    get resultType(): OperationResultType;
}
