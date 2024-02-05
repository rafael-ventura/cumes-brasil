import { SessionRevisionsMetadataOptions } from "./IRevisionsSessionOperations";
import { DocumentType } from "../DocumentAbstractions";
import { Lazy } from "../Lazy";
import { MetadataAsDictionary } from "../../Mapping/MetadataAsDictionary";
import { RevisionsCollectionObject } from "../../Types";
export interface ILazyRevisionsOperations {
    getFor<TEntity extends object>(id: string): Lazy<TEntity[]>;
    getFor<TEntity extends object>(id: string, options: LazySessionRevisionsOptions<TEntity>): Lazy<TEntity[]>;
    getMetadataFor(id: string): Lazy<MetadataAsDictionary[]>;
    getMetadataFor(id: string, options: SessionRevisionsMetadataOptions): Lazy<MetadataAsDictionary[]>;
    get<TEntity extends object>(id: string, date: Date): Lazy<TEntity>;
    get<TEntity extends object>(changeVector: string): Lazy<TEntity>;
    get<TEntity extends object>(changeVector: string, documentType: DocumentType<TEntity>): Lazy<TEntity>;
    get<TEntity extends object>(changeVectors: string[]): Lazy<RevisionsCollectionObject<TEntity>>;
    get<TEntity extends object>(changeVectors: string[], documentType: DocumentType<TEntity>): Lazy<RevisionsCollectionObject<TEntity>>;
}
export interface LazySessionRevisionsOptions<T extends object> {
    start?: number;
    pageSize?: number;
    documentType?: DocumentType<T>;
}
export interface LazySessionRevisionsMetadataOptions {
    start?: number;
    pageSize?: number;
}
