import { IDocumentStore } from "../IDocumentStore";
import { TimeValue } from "../../Primitives/TimeValue";
import { ClassConstructor } from "../../Types";
import { DocumentConventions } from "../Conventions/DocumentConventions";
export declare class TimeSeriesOperations {
    private readonly _store;
    private readonly _database;
    private readonly _executor;
    constructor(store: IDocumentStore);
    constructor(store: IDocumentStore, database: string);
    register<TCollection extends object, TTimeSeriesEntry extends object>(collectionClass: ClassConstructor<TCollection>, timeSeriesEntryClass: ClassConstructor<TTimeSeriesEntry>): Promise<void>;
    register<TCollection extends object, TTimeSeriesEntry extends object>(collectionClass: ClassConstructor<TCollection>, timeSeriesEntryClass: ClassConstructor<TTimeSeriesEntry>, name: string): Promise<void>;
    register<TCollection extends object>(collectionClass: ClassConstructor<TCollection>, name: string, valueNames: string[]): Promise<void>;
    register(collection: string, name: string, valueNames: string[]): Promise<void>;
    private _registerInternal;
    setPolicy<TCollection extends object>(collectionClass: ClassConstructor<TCollection>, name: string, aggregation: TimeValue, retention: TimeValue): Promise<void>;
    setPolicy<TCollection extends object>(collection: string, name: string, aggregation: TimeValue, retention: TimeValue): Promise<void>;
    setRawPolicy<TCollection extends object>(collectionClass: ClassConstructor<TCollection>, retention: TimeValue): Promise<void>;
    setRawPolicy(collection: string, retention: TimeValue): Promise<void>;
    removePolicy(collection: string, name: string): Promise<void>;
    removePolicy<TCollection extends object>(clazz: ClassConstructor<TCollection>, name: string): Promise<void>;
    static getTimeSeriesName<TTimeSeriesEntry extends object>(clazz: ClassConstructor<TTimeSeriesEntry>, conventions: DocumentConventions): string;
    forDatabase(database: string): TimeSeriesOperations;
}
