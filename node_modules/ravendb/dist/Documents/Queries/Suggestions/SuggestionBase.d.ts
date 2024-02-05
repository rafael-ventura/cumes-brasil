import { SuggestionOptions } from "./SuggestionOptions";
export declare abstract class SuggestionBase {
    field: string;
    displayField: string;
    options: SuggestionOptions;
    protected constructor(field: string);
}
