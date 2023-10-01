import { ILoaderWithInclude } from "./ILoaderWithInclude";
import { IDocumentSessionImpl } from "../IDocumentSession";
import { DocumentType } from "../../DocumentAbstractions";
import { EntitiesCollectionObject } from "../../../Types";
export declare class MultiLoaderWithInclude implements ILoaderWithInclude {
    private _session;
    private _includes;
    include(path: string): ILoaderWithInclude;
    load<TResult extends object>(id: string, documentType?: DocumentType<TResult>): Promise<TResult | null>;
    load<TResult extends object>(id: string, documentType?: DocumentType<TResult>): Promise<TResult | null>;
    load<TResult extends object>(ids: string[], documentType?: DocumentType<TResult>): Promise<EntitiesCollectionObject<TResult>>;
    constructor(session: IDocumentSessionImpl);
}
