import { QueryResult } from "../QueryResult";
import { Lazy } from "../../Lazy";
import { InMemoryDocumentSessionOperations } from "../../Session/InMemoryDocumentSessionOperations";
import { IndexQuery } from "../IndexQuery";
import { SuggestionsResponseObject } from "../../../Types";
export declare abstract class SuggestionQueryBase {
    private readonly _session;
    private _query;
    private _duration;
    protected constructor(session: InMemoryDocumentSessionOperations);
    execute(): Promise<SuggestionsResponseObject>;
    private _processResults;
    executeLazy(): Lazy<SuggestionsResponseObject>;
    protected abstract _getIndexQuery(updateAfterQueryExecuted?: boolean): IndexQuery;
    protected abstract _invokeAfterQueryExecuted(result: QueryResult): void;
    private _getCommand;
    toString(): string;
}
