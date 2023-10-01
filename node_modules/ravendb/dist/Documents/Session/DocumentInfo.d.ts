import { ConcurrencyCheckMode } from "./IDocumentSession";
import { IMetadataDictionary } from "./IMetadataDictionary";
import { IRavenObject } from "../../Types/IRavenObject";
import { MetadataObject } from "./MetadataObject";
export declare class DocumentInfo {
    id: string;
    changeVector: string;
    concurrencyCheckMode: ConcurrencyCheckMode;
    ignoreChanges: boolean;
    metadata: MetadataObject;
    document: IRavenObject;
    metadataInstance: IMetadataDictionary;
    entity: object;
    newDocument: boolean;
    collection: string;
    static getNewDocumentInfo(document: object): DocumentInfo;
}
