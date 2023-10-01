export interface ISessionDocumentCounters extends ISessionDocumentCountersBase {
    getAll(): Promise<{
        [key: string]: number;
    }>;
    get(counter: string): Promise<number | null>;
    get(counters: string[]): Promise<{
        [key: string]: number;
    }>;
}
export interface ISessionDocumentCountersBase {
    increment(counter: string): void;
    increment(counter: string, delta: number): void;
    delete(counter: string): void;
}
