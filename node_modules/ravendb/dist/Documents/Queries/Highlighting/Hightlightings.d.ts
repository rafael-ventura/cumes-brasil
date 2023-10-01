import { QueryResultHighlightings } from "../GenericQueryResult";
export declare class Highlightings {
    private _highlightings;
    private _fieldName;
    constructor(fieldName: string);
    get fieldName(): string;
    get resultIndents(): string[];
    getFragments(key: string): string[];
    update(highlightings: QueryResultHighlightings): void;
}
