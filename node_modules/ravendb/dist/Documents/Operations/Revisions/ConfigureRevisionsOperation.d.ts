import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { RevisionsConfiguration } from "../RevisionsConfiguration";
import { RavenCommand } from "../../../Http/RavenCommand";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { ServerNode } from "../../../Http/ServerNode";
import { IRaftCommand } from "../../../Http/IRaftCommand";
export declare class ConfigureRevisionsOperation implements IMaintenanceOperation<ConfigureRevisionsOperationResult> {
    private readonly _configuration;
    get resultType(): OperationResultType;
    constructor(configuration: RevisionsConfiguration);
    getCommand(conventions: DocumentConventions): RavenCommand<ConfigureRevisionsOperationResult>;
}
export declare class ConfigureRevisionsCommand extends RavenCommand<ConfigureRevisionsOperationResult> implements IRaftCommand {
    private readonly _configuration;
    constructor(configuration: RevisionsConfiguration);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    getRaftUniqueRequestId(): string;
}
export declare class ConfigureRevisionsOperationResult {
    raftCommandIndex: number;
}
