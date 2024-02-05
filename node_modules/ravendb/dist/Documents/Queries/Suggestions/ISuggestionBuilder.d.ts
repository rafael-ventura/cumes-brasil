import { ISuggestionOperations } from "./ISuggestionOperations";
import { Field } from "../../../Types";
export interface ISuggestionBuilder<T> {
    byField(fieldName: Field<T>, term: string): ISuggestionOperations<T>;
    byField(fieldName: Field<T>, terms: string[]): ISuggestionOperations<T>;
}
