import { ILazyRevisionsOperations, LazySessionRevisionsOptions } from "../../ILazyRevisionsOperations";
import { DocumentSession } from "../../DocumentSession";
import { Lazy } from "../../../Lazy";
import { MetadataAsDictionary } from "../../../../Mapping/MetadataAsDictionary";
import { SessionRevisionsMetadataOptions } from "../../IRevisionsSessionOperations";
import { DocumentType } from "../../../DocumentAbstractions";
import { RevisionsCollectionObject } from "../../../../Types";
export declare class LazyRevisionOperations implements ILazyRevisionsOperations {
    protected readonly delegate: DocumentSession;
    constructor(delegate: DocumentSession);
    getMetadataFor(id: string): Lazy<MetadataAsDictionary[]>;
    getMetadataFor(id: string, options: SessionRevisionsMetadataOptions): Lazy<MetadataAsDictionary[]>;
    get<TEntity extends object>(id: string, date: Date): Lazy<TEntity | null>;
    get<TEntity extends object>(changeVector: string): Lazy<TEntity | null>;
    get<TEntity extends object>(changeVector: string, documentType: DocumentType<TEntity>): Lazy<TEntity | null>;
    get<TEntity extends object>(changeVectors: string[]): Lazy<RevisionsCollectionObject<TEntity>>;
    get<TEntity extends object>(changeVectors: string[], documentType: DocumentType<TEntity>): Lazy<RevisionsCollectionObject<TEntity>>;
    private _get;
    private _getByIdAndDate;
    getFor<TEntity extends object>(id: string): Lazy<TEntity[]>;
    getFor<TEntity extends object>(id: string, options: LazySessionRevisionsOptions<TEntity>): Lazy<TEntity[]>;
}
