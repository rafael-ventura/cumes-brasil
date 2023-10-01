import { SessionTimeSeriesBase } from "./SessionTimeSeriesBase";
import { ISessionDocumentTypedTimeSeries } from "./ISessionDocumentTypedTimeSeries";
import { ClassConstructor } from "../../Types";
import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
import { TypedTimeSeriesEntry } from "./TimeSeries/TypedTimeSeriesEntry";
export declare class SessionDocumentTypedTimeSeries<T extends object> extends SessionTimeSeriesBase implements ISessionDocumentTypedTimeSeries<T> {
    private readonly _clazz;
    constructor(session: InMemoryDocumentSessionOperations, entity: any, name: string, clazz: ClassConstructor<T>);
    constructor(session: InMemoryDocumentSessionOperations, documentId: string, name: string, clazz: ClassConstructor<T>);
    get(): Promise<TypedTimeSeriesEntry<T>[]>;
    get(from: Date, to: Date): Promise<TypedTimeSeriesEntry<T>[]>;
    get(from: Date, to: Date, start: number): Promise<TypedTimeSeriesEntry<T>[]>;
    get(from: Date, to: Date, start: number, pageSize: number): Promise<TypedTimeSeriesEntry<T>[]>;
    private _getTyped;
    append(timestamp: Date, entry: T): void;
    append(timestamp: Date, entry: T, tag: string): void;
    append(entry: TypedTimeSeriesEntry<T>): void;
}
