import { QueryToken } from "./QueryToken";
export declare class FieldsToFetchToken extends QueryToken {
    fieldsToFetch: string[];
    projections: string[];
    customFunction: boolean;
    sourceAlias: string;
    private constructor();
    static create(fieldsToFetch: string[], projections: string[], customFunction: boolean): FieldsToFetchToken;
    static create(fieldsToFetch: string[], projections: string[], customFunction: boolean, sourceAlias: string): FieldsToFetchToken;
    writeTo(writer: any): void;
}
