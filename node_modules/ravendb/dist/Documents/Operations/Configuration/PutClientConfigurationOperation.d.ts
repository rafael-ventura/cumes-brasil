import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { ClientConfiguration } from "./ClientConfiguration";
import { RavenCommand, RavenCommandResponseType } from "../../../Http/RavenCommand";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { ServerNode } from "../../../Http/ServerNode";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { IRaftCommand } from "../../../Http/IRaftCommand";
export declare class PutClientConfigurationOperation implements IMaintenanceOperation<void> {
    private readonly _configuration;
    get resultType(): OperationResultType;
    constructor(configuration: ClientConfiguration);
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
}
export declare class PutClientConfigurationCommand extends RavenCommand<void> implements IRaftCommand {
    private readonly _configuration;
    get isReadRequest(): boolean;
    get responseType(): RavenCommandResponseType;
    constructor(conventions: DocumentConventions, configuration: ClientConfiguration);
    createRequest(node: ServerNode): HttpRequestParameters;
    getRaftUniqueRequestId(): string;
}
