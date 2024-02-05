import { CasingConvention } from "./ObjectUtil";
import { StringBuilder } from "./StringBuilder";
export declare class StringUtil {
    private static readonly letterRe;
    private static readonly digitRe;
    static leftPad(s: string, length: number, char: string): string;
    static toWebSocketPath(url: string): string;
    static format(s: string, vars?: object | any, ...varsArray: any[]): string;
    static validateDBName(dbName?: string): void;
    static escapeIfNecessary(field: string): string;
    static capitalize(s: string): string;
    static uncapitalize(s: string): string;
    static isCharacter(character: string): boolean;
    static isDigit(character: string): boolean;
    static isLetter(character: string): boolean;
    static isLetterOrDigit(character: string): boolean;
    static isNullOrEmpty(s?: string): boolean;
    static isNullOrWhitespace(s?: string): boolean;
    static changeCase(transformName: CasingConvention, s: string): string;
    static equalsIgnoreCase(s1: string, s2: string): boolean;
    static escapeString(builder: StringBuilder, value: string): void;
    private static _escapeStringInternal;
    static splice(input: string, start: number, delCount: number, newSubStr: string): string;
}
