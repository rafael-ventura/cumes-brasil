import { RavenCommand, IRavenResponse } from "../../Http/RavenCommand";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { RequestExecutor } from "../../Http/RequestExecutor";
export declare class OperationCompletionAwaiter {
    private _requestExecutor;
    private readonly _conventions;
    private readonly _id;
    private _nodeTag;
    get id(): number;
    constructor(requestExecutor: RequestExecutor, conventions: DocumentConventions, id: number, nodeTag?: string);
    private _fetchOperationStatus;
    protected _getOperationStateCommand(conventions: DocumentConventions, id: number, nodeTag?: string): RavenCommand<IRavenResponse>;
    get nodeTag(): string;
    set nodeTag(nodeTag: string);
    waitForCompletion(): Promise<void>;
}
