import { QueryToken } from "./QueryToken";
import { StringBuilder } from "../../../Utility/StringBuilder";
export declare class HighlightingToken extends QueryToken {
    private readonly _fieldName;
    private readonly _fragmentLength;
    private readonly _fragmentCount;
    private readonly _optionsParameterName;
    private constructor();
    static create(fieldName: string, fragmentLength: number, fragmentCount: number, optionsParameterName: string): HighlightingToken;
    writeTo(writer: StringBuilder): void;
}
