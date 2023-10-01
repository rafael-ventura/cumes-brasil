import { QueryToken } from "./QueryToken";
import { StringBuilder } from "../../../Utility/StringBuilder";
export declare class WithEdgesToken extends QueryToken {
    private readonly _alias;
    private readonly _edgeSelector;
    private readonly _query;
    constructor(alias: string, edgeSelector: string, query: string);
    writeTo(writer: StringBuilder): void;
}
