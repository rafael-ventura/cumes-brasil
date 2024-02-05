import { StringBuilder } from "../../../Utility/StringBuilder";
export declare abstract class QueryToken {
    abstract writeTo(writer: StringBuilder): any;
    static writeField(writer: StringBuilder, field: string): void;
    static isKeyword(field: string): boolean;
    private static RQL_KEYWORDS;
}
