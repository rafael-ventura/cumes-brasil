import { SessionTimeSeriesBase } from "./SessionTimeSeriesBase";
import { ISessionDocumentRollupTypedTimeSeries } from "./ISessionDocumentRollupTypedTimeSeries";
import { ClassConstructor } from "../../Types";
import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
import { TypedTimeSeriesRollupEntry } from "./TimeSeries/TypedTimeSeriesRollupEntry";
export declare class SessionDocumentRollupTypedTimeSeries<T extends object> extends SessionTimeSeriesBase implements ISessionDocumentRollupTypedTimeSeries<T> {
    private readonly _clazz;
    constructor(session: InMemoryDocumentSessionOperations, entity: any, name: string, clazz: ClassConstructor<T>);
    constructor(session: InMemoryDocumentSessionOperations, documentId: string, name: string, clazz: ClassConstructor<T>);
    get(): Promise<TypedTimeSeriesRollupEntry<T>[]>;
    get(from: Date, to: Date): Promise<TypedTimeSeriesRollupEntry<T>[]>;
    get(from: Date, to: Date, start: number): Promise<TypedTimeSeriesRollupEntry<T>[]>;
    get(from: Date, to: Date, start: number, pageSize: number): Promise<TypedTimeSeriesRollupEntry<T>[]>;
    append(entry: TypedTimeSeriesRollupEntry<T>): void;
}
