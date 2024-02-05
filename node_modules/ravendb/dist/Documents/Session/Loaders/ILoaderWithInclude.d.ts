import { DocumentType } from "../../DocumentAbstractions";
import { EntitiesCollectionObject } from "../../../Types";
export interface ILoaderWithInclude {
    include(path: string): ILoaderWithInclude;
    load<TResult extends object>(id: string, documentType: DocumentType<TResult>): Promise<TResult | null>;
    load<TResult extends object>(id: string, documentType?: DocumentType<TResult>): Promise<TResult | null>;
    load<TResult extends object>(ids: string[], documentType?: DocumentType<TResult>): Promise<EntitiesCollectionObject<TResult>>;
}
