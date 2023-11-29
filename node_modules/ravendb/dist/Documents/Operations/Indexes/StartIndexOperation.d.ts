import { IMaintenanceOperation, OperationResultType } from "../OperationAbstractions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { ServerNode } from "../../../Http/ServerNode";
export declare class StartIndexOperation implements IMaintenanceOperation<void> {
    private readonly _indexName;
    constructor(indexName: string);
    getCommand(conventions: DocumentConventions): RavenCommand<void>;
    get resultType(): OperationResultType;
}
export declare class StartIndexCommand extends RavenCommand<void> {
    private readonly _indexName;
    constructor(indexName: string);
    createRequest(node: ServerNode): HttpRequestParameters;
    get isReadRequest(): boolean;
}
