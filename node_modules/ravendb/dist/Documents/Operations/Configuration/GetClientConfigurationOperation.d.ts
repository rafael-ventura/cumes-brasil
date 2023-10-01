import * as stream from "readable-stream";
import { ServerNode } from "../../../Http/ServerNode";
import { RavenCommand } from "../../../Http/RavenCommand";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { ClientConfiguration } from "../Configuration/ClientConfiguration";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
export declare class GetClientConfigurationOperation implements IMaintenanceOperation<GetClientConfigurationOperationResult> {
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<GetClientConfigurationOperationResult>;
}
export declare class GetClientConfigurationCommand extends RavenCommand<GetClientConfigurationOperationResult> {
    constructor();
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
export interface GetClientConfigurationOperationResult {
    etag: string;
    configuration: ClientConfiguration;
}
