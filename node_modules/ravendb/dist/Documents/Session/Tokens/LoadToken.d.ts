import { QueryToken } from "./QueryToken";
export declare class LoadToken extends QueryToken {
    argument: string;
    alias: string;
    private constructor();
    static create(argument: string, alias: string): LoadToken;
    writeTo(writer: any): void;
}
