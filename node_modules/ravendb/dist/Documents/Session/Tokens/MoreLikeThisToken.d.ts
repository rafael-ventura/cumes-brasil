import { WhereToken } from "./WhereToken";
import { QueryToken } from "./QueryToken";
import { StringBuilder } from "../../../Utility/StringBuilder";
export declare class MoreLikeThisToken extends WhereToken {
    documentParameterName: string;
    optionsParameterName: string;
    whereTokens: QueryToken[];
    constructor();
    writeTo(writer: StringBuilder): void;
}
