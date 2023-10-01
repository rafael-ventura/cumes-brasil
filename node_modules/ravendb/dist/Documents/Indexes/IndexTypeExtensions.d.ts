import { IndexType } from "../Indexes/Enums";
export declare class IndexTypeExtensions {
    static isMap(type: IndexType): boolean;
    static isMapReduce(type: IndexType): boolean;
    static isAuto(type: IndexType): boolean;
    static isStatic(type: IndexType): boolean;
    static isJavaScript(type: IndexType): boolean;
}
