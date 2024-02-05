import { JsonSerializer } from "../../../Mapping/Json/Serializer";
import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { IndexDefinition } from "../../Indexes/IndexDefinition";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
import { ServerNode } from "../../../Http/ServerNode";
import { IRaftCommand } from "../../../Http/IRaftCommand";
export interface PutIndexResult {
    index: string;
    raftCommandIndex: number;
}
export declare class PutIndexesOperation implements IMaintenanceOperation<PutIndexResult[]> {
    get resultType(): OperationResultType;
    private readonly _indexToAdd;
    constructor(...indexToAdd: IndexDefinition[]);
    getCommand(conventions: DocumentConventions): RavenCommand<PutIndexResult[]>;
}
export declare class PutIndexesCommand extends RavenCommand<PutIndexResult[]> implements IRaftCommand {
    private readonly _indexToAdd;
    private _allJavaScriptIndexes;
    private readonly _conventions;
    constructor(conventions: DocumentConventions, indexesToAdd: IndexDefinition[]);
    protected get _serializer(): JsonSerializer;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
    getRaftUniqueRequestId(): string;
}
