import { IDocumentStore } from "../../Documents/IDocumentStore";
import { HiloRangeValue } from "./HiloRangeValue";
export declare class HiloIdGenerator {
    private _store;
    private readonly _dbName;
    private readonly _tag;
    private _conventions;
    private _lastRangeAt;
    private _range;
    private readonly _identityPartsSeparator;
    private _prefix?;
    private _lastBatchSize;
    private _serverTag;
    private _nextRangeTask;
    constructor(tag: string, store: IDocumentStore, dbName: string, identityPartsSeparator: string);
    generateDocumentId(entity: object): Promise<string>;
    protected _getDocumentIdFromId(nextId: number): string;
    nextId(): Promise<number>;
    returnUnusedRange(): Promise<void>;
    protected _getNextRange(): Promise<void>;
    protected _assembleDocumentId(currentRangeValue: number): string;
    get range(): HiloRangeValue;
    set range(value: HiloRangeValue);
}
