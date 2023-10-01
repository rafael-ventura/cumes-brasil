import { HttpRequestParameters } from "../../Primitives/Http";
import { IServerOperation, OperationIdResult, OperationResultType } from "./OperationAbstractions";
import { CompactSettings } from "../../ServerWide/CompactSettings";
import { RavenCommand } from "../../Http/RavenCommand";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { ServerNode } from "../../Http/ServerNode";
import * as stream from "readable-stream";
export declare class CompactDatabaseOperation implements IServerOperation<OperationIdResult> {
    private readonly _compactSettings;
    constructor(compactSettings: CompactSettings);
    getCommand(conventions: DocumentConventions): RavenCommand<OperationIdResult>;
    get resultType(): OperationResultType;
}
export declare class CompactDatabaseCommand extends RavenCommand<OperationIdResult> {
    private readonly _compactSettings;
    constructor(conventions: DocumentConventions, compactSettings: CompactSettings);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
