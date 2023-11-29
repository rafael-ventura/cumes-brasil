import { QueryToken } from "./QueryToken";
import { StringBuilder } from "../../../Utility/StringBuilder";
export declare class CounterIncludesToken extends QueryToken {
    private _sourcePath;
    private readonly _counterName;
    private readonly _all;
    private constructor();
    static create(sourcePath: string, counterName: string): CounterIncludesToken;
    static all(sourcePath: string): CounterIncludesToken;
    addAliasToPath(alias: string): void;
    writeTo(writer: StringBuilder): void;
}
