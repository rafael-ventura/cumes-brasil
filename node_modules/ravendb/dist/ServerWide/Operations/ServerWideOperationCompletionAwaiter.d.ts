import { OperationCompletionAwaiter } from "../../Documents/Operations/OperationCompletionAwaiter";
import { RavenCommand, IRavenResponse } from "../../Http/RavenCommand";
import { RequestExecutor } from "../../Http/RequestExecutor";
import { DocumentConventions } from "../../Documents/Conventions/DocumentConventions";
export declare class ServerWideOperationCompletionAwaiter extends OperationCompletionAwaiter {
    constructor(requestExecutor: RequestExecutor, conventions: DocumentConventions, id: number, nodeTag?: string);
    protected _getOperationStateCommand(conventions: DocumentConventions, id: number, nodeTag?: string): RavenCommand<IRavenResponse>;
}
