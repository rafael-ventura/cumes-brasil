import { QueryToken } from "./QueryToken";
import { StringBuilder } from "../../../Utility/StringBuilder";
export declare class WithToken extends QueryToken {
    private readonly _alias;
    private readonly _query;
    constructor(alias: string, query: string);
    writeTo(writer: StringBuilder): void;
}
