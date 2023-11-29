import { QueryToken } from "./QueryToken";
import { StringBuilder } from "../../../Utility/StringBuilder";
export declare class CompareExchangeValueIncludesToken extends QueryToken {
    private readonly _path;
    private constructor();
    static create(path: string): CompareExchangeValueIncludesToken;
    writeTo(writer: StringBuilder): void;
}
