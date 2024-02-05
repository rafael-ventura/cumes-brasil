import { ILazySessionOperations } from "./ILazySessionOperations";
import { DocumentSession } from "../../DocumentSession";
import { ILazyLoaderWithInclude } from "../../Loaders/ILazyLoaderWithInclude";
import { ObjectTypeDescriptor, EntitiesCollectionObject } from "../../../../Types";
import { Lazy } from "../../../Lazy";
import { SessionLoadStartingWithOptions } from "../../IDocumentSession";
import { ConditionalLoadResult } from "../../ConditionalLoadResult";
export declare class LazySessionOperations implements ILazySessionOperations {
    protected _delegate: DocumentSession;
    constructor(delegate: DocumentSession);
    include(path: string): ILazyLoaderWithInclude;
    load<TEntity extends object>(ids: string[], clazz: ObjectTypeDescriptor<TEntity>): Lazy<EntitiesCollectionObject<TEntity>>;
    load<TEntity extends object>(id: string, clazz: ObjectTypeDescriptor<TEntity>): Lazy<TEntity | null>;
    load<TEntity extends object>(ids: string[]): Lazy<EntitiesCollectionObject<TEntity>>;
    load<TEntity extends object>(id: string): Lazy<TEntity | null>;
    loadStartingWith<TEntity extends object>(idPrefix: string, opts: SessionLoadStartingWithOptions<TEntity>): Lazy<EntitiesCollectionObject<TEntity>>;
    loadStartingWith<TEntity extends object>(idPrefix: string): Lazy<EntitiesCollectionObject<TEntity>>;
    conditionalLoad<TEntity extends object>(id: string, changeVector: string, clazz: ObjectTypeDescriptor<TEntity>): Lazy<ConditionalLoadResult<TEntity>>;
}
