import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export declare class SeedIdentityForOperation implements IMaintenanceOperation<number> {
    private readonly _identityName;
    private readonly _identityValue;
    private readonly _forceUpdate;
    constructor(name: string, value: number, forceUpdate?: boolean);
    getCommand(conventions: DocumentConventions): RavenCommand<number>;
    get resultType(): OperationResultType;
}
