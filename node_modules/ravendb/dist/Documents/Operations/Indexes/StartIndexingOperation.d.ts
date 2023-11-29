import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
export declare class StartIndexingOperation implements IMaintenanceOperation<void> {
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
export declare class StartIndexingCommand extends RavenCommand<void> {
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
}
