import { QueryToken } from "./QueryToken";
export declare class SuggestToken extends QueryToken {
    private readonly _fieldName;
    private readonly _alias;
    private readonly _termParameterName;
    private readonly _optionsParameterName;
    private constructor();
    static create(fieldName: string, alias: string, termParameterName: string, optionsParameterName: string): SuggestToken;
    get fieldName(): string;
    writeTo(writer: any): void;
}
