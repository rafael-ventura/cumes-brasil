import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
export declare abstract class SessionCountersBase {
    protected _docId: string;
    protected _session: InMemoryDocumentSessionOperations;
    protected constructor(session: InMemoryDocumentSessionOperations, entityOrId: string | object);
    increment(counter: string): void;
    increment(counter: string, delta: number): void;
    delete(counter: string): void;
    protected _throwEntityNotInSession(entity: object): void;
    private static _throwIncrementCounterAfterDeleteAttempt;
    private static _throwDeleteCounterAfterIncrementAttempt;
    private static _throwDocumentAlreadyDeletedInSession;
}
