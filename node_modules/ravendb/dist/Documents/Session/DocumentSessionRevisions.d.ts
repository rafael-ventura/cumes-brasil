import { IRevisionsSessionOperations, SessionRevisionsMetadataOptions, SessionRevisionsOptions } from "./IRevisionsSessionOperations";
import { InMemoryDocumentSessionOperations } from "./InMemoryDocumentSessionOperations";
import { MetadataAsDictionary } from "../../Mapping/MetadataAsDictionary";
import { DocumentType } from "../DocumentAbstractions";
import { RevisionsCollectionObject } from "../../Types";
import { DocumentSessionRevisionsBase } from "./DocumentSessionRevisionsBase";
import { ILazyRevisionsOperations } from "./ILazyRevisionsOperations";
export declare class DocumentSessionRevisions extends DocumentSessionRevisionsBase implements IRevisionsSessionOperations {
    constructor(session: InMemoryDocumentSessionOperations);
    get lazily(): ILazyRevisionsOperations;
    getFor<TEntity extends object>(id: string): Promise<TEntity[]>;
    getFor<TEntity extends object>(id: string, options: SessionRevisionsOptions<TEntity>): Promise<TEntity[]>;
    getMetadataFor(id: string): Promise<MetadataAsDictionary[]>;
    getMetadataFor(id: string, options: SessionRevisionsMetadataOptions): Promise<MetadataAsDictionary[]>;
    get<TEntity extends object>(id: string, date: Date): Promise<TEntity | null>;
    get<TEntity extends object>(id: string, date: Date, documentType: DocumentType<TEntity>): Promise<TEntity | null>;
    get<TEntity extends object>(changeVector: string): Promise<TEntity | null>;
    get<TEntity extends object>(changeVector: string, documentType: DocumentType<TEntity>): Promise<TEntity | null>;
    get<TEntity extends object>(changeVectors: string[]): Promise<RevisionsCollectionObject<TEntity>>;
    get<TEntity extends object>(changeVectors: string[], documentType: DocumentType<TEntity>): Promise<RevisionsCollectionObject<TEntity>>;
    private _getByIdAndDate;
    private _get;
    getCountFor(id: string): Promise<number>;
}
