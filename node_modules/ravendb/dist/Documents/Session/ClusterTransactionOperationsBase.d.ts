import { CompareExchangeValue } from "../Operations/CompareExchange/CompareExchangeValue";
import { CompareExchangeResultClass } from "../../Types";
import { DocumentSession } from "./DocumentSession";
import { CompareExchangeSessionValue } from "../Operations/CompareExchange/CompareExchangeSessionValue";
import { CompareExchangeResultItem } from "../Operations/CompareExchange/CompareExchangeValueResultParser";
import { SaveChangesData } from "../Commands/CommandData";
export declare class StoredCompareExchange {
    readonly entity: any;
    readonly index: number;
    constructor(index: number, entity: any);
}
export declare abstract class ClusterTransactionOperationsBase {
    protected readonly _session: DocumentSession;
    private readonly _state;
    get numberOfTrackedCompareExchangeValues(): number;
    protected constructor(session: DocumentSession);
    get session(): DocumentSession;
    isTracked(key: string): boolean;
    createCompareExchangeValue<T>(key: string, item: T): CompareExchangeValue<T>;
    deleteCompareExchangeValue(key: string, index: number): void;
    deleteCompareExchangeValue<T>(item: CompareExchangeValue<T>): void;
    clear(): void;
    protected _getCompareExchangeValueInternal<T>(key: string): Promise<CompareExchangeValue<T>>;
    protected _getCompareExchangeValueInternal<T>(key: string, clazz: CompareExchangeResultClass<T>): Promise<CompareExchangeValue<T>>;
    protected _getCompareExchangeValuesInternal<T>(startsWith: string, clazz: CompareExchangeResultClass<T>, start: number, pageSize: number): Promise<{
        [key: string]: CompareExchangeValue<T>;
    }>;
    protected _getCompareExchangeValuesInternal<T>(keys: string[]): Promise<{
        [key: string]: CompareExchangeValue<T>;
    }>;
    protected _getCompareExchangeValuesInternal<T>(keys: string[], clazz: CompareExchangeResultClass<T>): Promise<{
        [key: string]: CompareExchangeValue<T>;
    }>;
    getCompareExchangeValueFromSessionInternal<T>(key: string, notTracked: (value: boolean) => void, clazz: CompareExchangeResultClass<T>): CompareExchangeValue<T>;
    getCompareExchangeValuesFromSessionInternal<T>(keys: string[], notTrackedKeysSetter: (values: Set<string>) => void, clazz: CompareExchangeResultClass<T>): {
        [key: string]: CompareExchangeValue<T>;
    };
    registerMissingCompareExchangeValue(key: string): CompareExchangeSessionValue;
    registerCompareExchangeValues(values: Record<string, CompareExchangeResultItem>): void;
    registerCompareExchangeValue(value: CompareExchangeValue<any>): CompareExchangeSessionValue;
    private _tryGetCompareExchangeValueFromSession;
    prepareCompareExchangeEntities(result: SaveChangesData): void;
    updateState(key: string, index: number): void;
}
