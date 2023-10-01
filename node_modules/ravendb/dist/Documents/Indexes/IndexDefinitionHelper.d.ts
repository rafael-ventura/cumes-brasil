import { IndexType } from "./Enums";
import { IndexSourceType } from "./IndexSourceType";
export declare class IndexDefinitionHelper {
    static detectStaticIndexType(map: string, reduce: string): IndexType;
    static extractEnumNotation(functionBody: string): string;
    static detectStaticIndexSourceType(map: string): IndexSourceType;
    private static _stripComments;
    private static _unifyWhiteSpace;
}
