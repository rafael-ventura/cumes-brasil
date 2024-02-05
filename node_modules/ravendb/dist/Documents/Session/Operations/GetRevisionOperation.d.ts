import { InMemoryDocumentSessionOperations } from "../InMemoryDocumentSessionOperations";
import { GetRevisionsCommand } from "../../Commands/GetRevisionsCommand";
import { IRavenArrayResult, RevisionsCollectionObject } from "../../../Types";
import { MetadataAsDictionary } from "../../../Mapping/MetadataAsDictionary";
import { DocumentType } from "../../DocumentAbstractions";
export declare class GetRevisionOperation {
    private readonly _session;
    private _result;
    private readonly _command;
    constructor(session: InMemoryDocumentSessionOperations, id: string, before: Date);
    constructor(session: InMemoryDocumentSessionOperations, id: string, start: number, pageSize: number);
    constructor(session: InMemoryDocumentSessionOperations, id: string, start: number, pageSize: number, metadataOnly: boolean);
    constructor(session: InMemoryDocumentSessionOperations, changeVector: string);
    constructor(session: InMemoryDocumentSessionOperations, changeVectors: string[]);
    createRequest(): GetRevisionsCommand;
    set result(result: IRavenArrayResult);
    get command(): GetRevisionsCommand;
    private _getRevision;
    getRevisionsFor<TEntity extends object>(documentType: DocumentType<TEntity>): TEntity[];
    getRevisionsMetadataFor(): MetadataAsDictionary[];
    getRevision<TEntity extends object>(documentType: DocumentType<TEntity>): TEntity | null;
    getRevisions<TEntity extends object>(documentType: DocumentType<TEntity>): RevisionsCollectionObject<TEntity>;
}
