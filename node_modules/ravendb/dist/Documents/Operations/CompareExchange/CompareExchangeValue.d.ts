import { ICompareExchangeValue } from "./ICompareExchangeValue";
import { IMetadataDictionary } from "../../Session/IMetadataDictionary";
export declare class CompareExchangeValue<T> implements ICompareExchangeValue {
    key: string;
    index: number;
    value: T;
    private _metadataAsDictionary;
    constructor(key: string, index: number, value: T, metadata?: IMetadataDictionary);
    get metadata(): IMetadataDictionary;
    hasMetadata(): boolean;
}
