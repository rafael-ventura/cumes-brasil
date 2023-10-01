import { ISuggestionDocumentQuery } from "./ISuggestionDocumentQuery";
import { SuggestionQueryBase } from "./SuggestionQueryBase";
import { QueryResult } from "../QueryResult";
import { DocumentQuery } from "../../Session/DocumentQuery";
import { IndexQuery } from "../IndexQuery";
import { SuggestionBase } from "./SuggestionBase";
import { ISuggestionBuilder } from "./ISuggestionBuilder";
export declare class SuggestionDocumentQuery<T extends object> extends SuggestionQueryBase implements ISuggestionDocumentQuery<T> {
    private readonly _source;
    constructor(source: DocumentQuery<T>);
    protected _getIndexQuery(updateAfterQueryExecuted?: boolean): IndexQuery;
    protected _invokeAfterQueryExecuted(result: QueryResult): void;
    andSuggestUsing(suggestion: SuggestionBase): ISuggestionDocumentQuery<T>;
    andSuggestUsing(builder: (b: ISuggestionBuilder<T>) => void): ISuggestionDocumentQuery<T>;
}
