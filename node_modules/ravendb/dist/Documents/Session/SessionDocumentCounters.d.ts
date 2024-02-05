import { SessionCountersBase } from "./SessionCountersBase";
import { ISessionDocumentCounters } from "./ISessionDocumentCounters";
import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
export declare class SessionDocumentCounters extends SessionCountersBase implements ISessionDocumentCounters {
    constructor(session: InMemoryDocumentSessionOperations, entity: object);
    constructor(session: InMemoryDocumentSessionOperations, documentId: string);
    getAll(): Promise<{
        [key: string]: number;
    }>;
    get(counter: string): Promise<number | null>;
    get(counters: string[]): Promise<{
        [key: string]: number;
    }>;
    private _getCounter;
    private _getCounters;
}
