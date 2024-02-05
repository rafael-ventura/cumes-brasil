import { InMemoryDocumentSessionOperations } from "../InMemoryDocumentSessionOperations";
import { GetDocumentsCommand, GetDocumentsResult } from "../../Commands/GetDocumentsCommand";
import { StartingWithOptions } from "../IDocumentSession";
import { DocumentType } from "../../DocumentAbstractions";
export declare class LoadStartingWithOperation {
    static DEFAULT: StartingWithOptions;
    private _session;
    private _startWith;
    private _matches;
    private _start;
    private _pageSize;
    private _exclude;
    private _startAfter;
    private _returnedIds;
    private _resultsSet;
    private _results;
    constructor(session: InMemoryDocumentSessionOperations);
    createRequest(): GetDocumentsCommand;
    withStartWith(idPrefix: string, opts: StartingWithOptions): void;
    setResult(result: GetDocumentsResult): void;
    getDocuments<T extends object>(docType: DocumentType<T>): T[];
    private _getDocument;
}
