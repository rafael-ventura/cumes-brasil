import { ILazyLoaderWithInclude } from "./ILazyLoaderWithInclude";
import { IDocumentSessionImpl } from "../IDocumentSession";
import { ObjectTypeDescriptor, EntitiesCollectionObject } from "../../../Types";
import { Lazy } from "../../Lazy";
export declare class LazyMultiLoaderWithInclude implements ILazyLoaderWithInclude {
    private readonly _session;
    private readonly _includes;
    constructor(session: IDocumentSessionImpl);
    include(path: string): ILazyLoaderWithInclude;
    load<TResult extends object>(ids: string[]): Lazy<EntitiesCollectionObject<TResult>>;
    load<TResult extends object>(ids: string[], clazz: ObjectTypeDescriptor<TResult>): Lazy<EntitiesCollectionObject<TResult>>;
    load<TResult extends object>(id: string): Lazy<TResult | null>;
    load<TResult extends object>(id: string, clazz?: ObjectTypeDescriptor<TResult>): Lazy<TResult | null>;
}
