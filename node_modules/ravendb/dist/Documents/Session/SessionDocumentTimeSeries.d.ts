import { SessionTimeSeriesBase } from "./SessionTimeSeriesBase";
import { ISessionDocumentTimeSeries } from "./ISessionDocumentTimeSeries";
import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
import { TimeSeriesEntry } from "./TimeSeries/TimeSeriesEntry";
import { ITimeSeriesIncludeBuilder } from "./Loaders/ITimeSeriesIncludeBuilder";
export declare class SessionDocumentTimeSeries extends SessionTimeSeriesBase implements ISessionDocumentTimeSeries {
    constructor(session: InMemoryDocumentSessionOperations, entity: any, name: string);
    constructor(session: InMemoryDocumentSessionOperations, documentId: string, name: string);
    get(): Promise<TimeSeriesEntry[]>;
    get(start: number, pageSize: number): Promise<TimeSeriesEntry[]>;
    get(from: Date, to: Date): Promise<TimeSeriesEntry[]>;
    get(from: Date, to: Date, start: number): Promise<TimeSeriesEntry[]>;
    get(from: Date, to: Date, start: number, pageSize: number): Promise<TimeSeriesEntry[]>;
    get(from: Date, to: Date, includes: (builder: ITimeSeriesIncludeBuilder) => void): Promise<TimeSeriesEntry[]>;
    get(from: Date, to: Date, includes: (builder: ITimeSeriesIncludeBuilder) => void, start: number): Promise<TimeSeriesEntry[]>;
    get(from: Date, to: Date, includes: (builder: ITimeSeriesIncludeBuilder) => void, start: number, pageSize: number): Promise<TimeSeriesEntry[]>;
    private _getInternal;
    append(timestamp: Date, value: number): void;
    append(timestamp: Date, value: number, tag: string): void;
    append(timestamp: Date, values: number[]): void;
    append(timestamp: Date, values: number[], tag: string): void;
}
