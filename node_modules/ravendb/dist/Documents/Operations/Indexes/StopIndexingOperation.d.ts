import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
export declare class StopIndexingOperation implements IMaintenanceOperation<void> {
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
export declare class StopIndexingCommand extends RavenCommand<void> {
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
}
