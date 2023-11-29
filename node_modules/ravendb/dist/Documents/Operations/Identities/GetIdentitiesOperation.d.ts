import { HttpRequestParameters } from "../../../Primitives/Http";
import { OperationResultType, IMaintenanceOperation } from "../OperationAbstractions";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
import * as stream from "readable-stream";
export interface IdentitiesCollection {
    [key: string]: number;
}
export declare class GetIdentitiesOperation implements IMaintenanceOperation<IdentitiesCollection> {
    get resultType(): OperationResultType;
    getCommand(conventions: DocumentConventions): RavenCommand<IdentitiesCollection>;
}
export declare class GetIdentitiesCommand extends RavenCommand<IdentitiesCollection> {
    constructor();
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
