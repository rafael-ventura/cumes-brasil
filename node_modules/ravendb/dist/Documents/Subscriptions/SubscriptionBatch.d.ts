import { DocumentType } from "../DocumentAbstractions";
import { RequestExecutor } from "../../Http/RequestExecutor";
import { IDocumentStore } from "../IDocumentStore";
import { IDocumentSession } from "../Session/IDocumentSession";
import { SessionOptions } from "../Session/SessionOptions";
import { BatchFromServer } from "./BatchFromServer";
import { IMetadataDictionary } from "../Session/IMetadataDictionary";
export declare class SubscriptionBatch<T extends object> {
    private readonly _documentType;
    private readonly _revisions;
    private readonly _requestExecutor;
    private readonly _store;
    private readonly _dbName;
    private readonly _logger;
    private readonly _generateEntityIdOnTheClient;
    private readonly _items;
    private _includes;
    private _counterIncludes;
    private _timeSeriesIncludes;
    get items(): Item<T>[];
    openSession(): IDocumentSession;
    openSession(options: SessionOptions): IDocumentSession;
    private _openSessionInternal;
    getNumberOfItemsInBatch(): number;
    getNumberOfIncludes(): number;
    constructor(documentType: DocumentType, revisions: boolean, requestExecutor: RequestExecutor, store: IDocumentStore, dbName: string);
    private static _validateSessionOptions;
    private _loadDataToSession;
    initialize(batch: BatchFromServer): string;
    private static _throwRequired;
}
export declare class Item<T> {
    private _result;
    exceptionMessage: string;
    id: string;
    changeVector: string;
    projection: boolean;
    revision: boolean;
    private _throwItemProcessError;
    get result(): T;
    set result(result: T);
    rawResult: any;
    rawMetadata: any;
    private _metadata;
    get metadata(): IMetadataDictionary;
}
