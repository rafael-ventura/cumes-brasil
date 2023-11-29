import { RevisionsCollectionObject } from "../../Types";
import { DocumentType } from "../DocumentAbstractions";
import { MetadataAsDictionary } from "../../Mapping/MetadataAsDictionary";
import { ForceRevisionStrategy } from "./ForceRevisionStrategy";
import { ILazyRevisionsOperations } from "./ILazyRevisionsOperations";
export interface IRevisionsSessionOperations {
    getFor<TEntity extends object>(id: string): Promise<TEntity[]>;
    getFor<TEntity extends object>(id: string, options: SessionRevisionsOptions<TEntity>): Promise<TEntity[]>;
    getMetadataFor(id: string): Promise<MetadataAsDictionary[]>;
    getMetadataFor(id: string, options: SessionRevisionsMetadataOptions): Promise<MetadataAsDictionary[]>;
    get<TEntity extends object>(id: string, date: Date): Promise<TEntity>;
    get<TEntity extends object>(id: string, date: Date, documentType: DocumentType<TEntity>): Promise<TEntity>;
    get<TEntity extends object>(changeVector: string): Promise<TEntity>;
    get<TEntity extends object>(changeVector: string, documentType: DocumentType<TEntity>): Promise<TEntity>;
    get<TEntity extends object>(changeVectors: string[]): Promise<RevisionsCollectionObject<TEntity>>;
    get<TEntity extends object>(changeVectors: string[], documentType: DocumentType<TEntity>): Promise<RevisionsCollectionObject<TEntity>>;
    forceRevisionCreationFor<T extends object>(entity: T): void;
    forceRevisionCreationFor<T extends object>(entity: T, strategy: ForceRevisionStrategy): void;
    forceRevisionCreationFor(id: string): any;
    forceRevisionCreationFor(id: string, strategy: ForceRevisionStrategy): void;
    getCountFor(id: string): Promise<number>;
    lazily: ILazyRevisionsOperations;
}
export interface SessionRevisionsOptions<T extends object> {
    start?: number;
    pageSize?: number;
    documentType?: DocumentType<T>;
}
export interface SessionRevisionsMetadataOptions {
    start?: number;
    pageSize?: number;
}
