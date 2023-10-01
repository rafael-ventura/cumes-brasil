import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
import { TimeSeriesEntry } from "./TimeSeries/TimeSeriesEntry";
import { ITimeSeriesIncludeBuilder } from "./Loaders/ITimeSeriesIncludeBuilder";
export declare class SessionTimeSeriesBase {
    protected docId: string;
    protected name: string;
    protected session: InMemoryDocumentSessionOperations;
    protected constructor(session: InMemoryDocumentSessionOperations, entity: any, name: string);
    protected constructor(session: InMemoryDocumentSessionOperations, documentId: string, name: string);
    protected _appendInternal(timestamp: Date, valueOrValues: number[] | number, tag?: string): void;
    delete(): void;
    delete(from: Date, to: Date): void;
    deleteAt(at: Date): void;
    private static _throwDocumentAlreadyDeletedInSession;
    protected _throwEntityNotInSession(): void;
    getTimeSeriesAndIncludes(from: Date, to: Date, includes: (builder: ITimeSeriesIncludeBuilder) => void, start: number, pageSize: number): Promise<TimeSeriesEntry[]>;
    private _handleIncludes;
    private static _skipAndTrimRangeIfNeeded;
    protected _serveFromCache(from: Date, to: Date, start: number, pageSize: number, includes: (builder: ITimeSeriesIncludeBuilder) => void): Promise<TimeSeriesEntry[]>;
    private _registerIncludes;
    private static _mergeRangesWithResults;
    private static _chopRelevantRange;
    protected _getFromCache(from: Date, to: Date, includes: (builder: ITimeSeriesIncludeBuilder) => void, start: number, pageSize: number): Promise<TimeSeriesEntry[]>;
    protected _notInCache(from: Date, to: Date): boolean;
}
export interface CachedEntryInfo {
    servedFromCache: boolean;
    resultToUser: TimeSeriesEntry[];
    mergedValues: TimeSeriesEntry[];
    fromRangeIndex: number;
    toRangeIndex: number;
}
