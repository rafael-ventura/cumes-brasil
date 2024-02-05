import { CompareExchangeValue } from "../Operations/CompareExchange/CompareExchangeValue";
import { CompareExchangeResultClass } from "../../Types";
import { ClusterTransactionOperationsBase } from "./ClusterTransactionOperationsBase";
import { IClusterTransactionOperations } from "./IClusterTransactionOperations";
import { LazyClusterTransactionOperations } from "./Operations/Lazy/LazyClusterTransactionOperations";
import { DocumentSession } from "./DocumentSession";
export declare class ClusterTransactionOperations extends ClusterTransactionOperationsBase implements IClusterTransactionOperations {
    constructor(session: DocumentSession);
    get lazily(): LazyClusterTransactionOperations;
    getCompareExchangeValue<T>(key: string): Promise<CompareExchangeValue<T>>;
    getCompareExchangeValue<T>(key: string, type: CompareExchangeResultClass<T>): Promise<CompareExchangeValue<T>>;
    getCompareExchangeValues<T>(keys: string[]): Promise<{
        [key: string]: CompareExchangeValue<T>;
    }>;
    getCompareExchangeValues<T>(keys: string[], type: CompareExchangeResultClass<T>): Promise<{
        [key: string]: CompareExchangeValue<T>;
    }>;
    getCompareExchangeValues<T>(startsWith: string): Promise<{
        [key: string]: CompareExchangeValue<T>;
    }>;
    getCompareExchangeValues<T>(startsWith: string, type: CompareExchangeResultClass<T>): Promise<{
        [key: string]: CompareExchangeValue<T>;
    }>;
    getCompareExchangeValues<T>(startsWith: string, type: CompareExchangeResultClass<T>, start: number): Promise<{
        [key: string]: CompareExchangeValue<T>;
    }>;
    getCompareExchangeValues<T>(startsWith: string, type: CompareExchangeResultClass<T>, start: number, pageSize: number): Promise<{
        [key: string]: CompareExchangeValue<T>;
    }>;
}
