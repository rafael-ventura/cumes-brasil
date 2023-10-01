import { QueryToken } from "./QueryToken";
export declare class OpenSubclauseToken extends QueryToken {
    private constructor();
    boostParameterName: string;
    static create(): OpenSubclauseToken;
    writeTo(writer: any): void;
}
