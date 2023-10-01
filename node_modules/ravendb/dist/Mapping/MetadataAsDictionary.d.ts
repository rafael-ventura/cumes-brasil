import { IMetadataDictionary, IRawMetadataDictionary } from "../Documents/Session/IMetadataDictionary";
export interface MetadataAsDictionaryParentInfo {
    parent: IMetadataDictionary;
    parentKey: string;
}
export interface MetadataAsDictionary extends IMetadataDictionary, MetadataAsDictionaryParentInfo {
}
export interface MetadataParameters {
    raw: IRawMetadataDictionary;
    parentInfo?: MetadataAsDictionaryParentInfo;
}
export declare class MetadataDictionary {
    static create(raw?: object): MetadataAsDictionary;
    static materializeFromJson(metadata?: object): MetadataAsDictionary;
}
export declare function createMetadataDictionary(metadataParams: MetadataParameters): MetadataAsDictionary;
