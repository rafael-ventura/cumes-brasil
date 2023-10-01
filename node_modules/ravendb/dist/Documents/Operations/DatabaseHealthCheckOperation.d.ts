import { IMaintenanceOperation, OperationResultType } from "./OperationAbstractions";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { RavenCommand } from "../../Http/RavenCommand";
export declare class DatabaseHealthCheckOperation implements IMaintenanceOperation<void> {
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
    get resultType(): OperationResultType;
}
