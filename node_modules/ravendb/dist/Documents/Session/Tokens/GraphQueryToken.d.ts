import { QueryToken } from "./QueryToken";
import { StringBuilder } from "../../../Utility/StringBuilder";
export declare class GraphQueryToken extends QueryToken {
    private readonly _query;
    constructor(query: string);
    writeTo(writer: StringBuilder): void;
}
