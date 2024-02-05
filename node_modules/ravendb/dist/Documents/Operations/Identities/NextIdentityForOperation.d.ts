import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class NextIdentityForOperation implements IMaintenanceOperation<number> {
    private readonly _identityName;
    constructor(name: string);
    getCommand(conventions: DocumentConventions): RavenCommand<number>;
    get resultType(): OperationResultType;
}
