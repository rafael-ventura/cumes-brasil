import { ISuggestionBuilder } from "./ISuggestionBuilder";
import { ISuggestionOperations } from "./ISuggestionOperations";
import { SuggestionOptions } from "./SuggestionOptions";
import { SuggestionBase } from "./SuggestionBase";
import { Field } from "../../../Types";
export declare class SuggestionBuilder<T> implements ISuggestionBuilder<T>, ISuggestionOperations<T> {
    private _term;
    private _terms;
    withDisplayName(displayName: string): ISuggestionOperations<T>;
    byField(fieldName: Field<T>, term: string): ISuggestionOperations<T>;
    byField(fieldName: Field<T>, terms: string[]): ISuggestionOperations<T>;
    withOptions(options: SuggestionOptions): ISuggestionOperations<T>;
    get suggestion(): SuggestionBase;
}
