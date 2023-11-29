import { OperationExecutor } from "./OperationExecutor";
import { InMemoryDocumentSessionOperations } from "../Session/InMemoryDocumentSessionOperations";
export declare class SessionOperationExecutor extends OperationExecutor {
    private readonly _session;
    constructor(session: InMemoryDocumentSessionOperations);
    forDatabase(databaseName: string): never;
}
