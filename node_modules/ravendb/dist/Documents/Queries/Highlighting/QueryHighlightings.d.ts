import { Highlightings } from "./Hightlightings";
import { QueryResult } from "../QueryResult";
export declare class QueryHighlightings {
    private readonly _highlightings;
    add(fieldName: string): Highlightings;
    update(queryResult: QueryResult): void;
}
