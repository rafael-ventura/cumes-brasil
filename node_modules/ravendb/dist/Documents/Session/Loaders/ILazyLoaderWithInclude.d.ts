import { ObjectTypeDescriptor, EntitiesCollectionObject } from "../../../Types";
import { Lazy } from "../../Lazy";
export interface ILazyLoaderWithInclude {
    include(path: string): ILazyLoaderWithInclude;
    load<TResult extends object>(ids: string[]): Lazy<EntitiesCollectionObject<TResult>>;
    load<TResult extends object>(ids: string[], clazz: ObjectTypeDescriptor<TResult>): Lazy<EntitiesCollectionObject<TResult>>;
    load<TResult extends object>(id: string, clazz?: ObjectTypeDescriptor<TResult>): Lazy<TResult | null>;
    load<TResult extends object>(id: string): Lazy<TResult | null>;
}
