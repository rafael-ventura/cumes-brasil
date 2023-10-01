import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { IndexDefinition } from "../../Indexes/IndexDefinition";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
export declare class IndexHasChangedOperation implements IMaintenanceOperation<boolean> {
    private readonly _definition;
    constructor(definition: IndexDefinition);
    getCommand(conventions: DocumentConventions): RavenCommand<boolean>;
    get resultType(): OperationResultType;
}
export declare class IndexHasChangedCommand extends RavenCommand<boolean> {
    private readonly _definition;
    constructor(conventions: DocumentConventions, definition: IndexDefinition);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
