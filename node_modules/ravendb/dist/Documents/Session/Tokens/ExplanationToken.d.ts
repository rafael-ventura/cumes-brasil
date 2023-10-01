import { QueryToken } from "./QueryToken";
import { StringBuilder } from "../../../Utility/StringBuilder";
export declare class ExplanationToken extends QueryToken {
    private readonly _optionsParameterName;
    private constructor();
    static create(optionsParameterName: string): ExplanationToken;
    writeTo(writer: StringBuilder): void;
}
