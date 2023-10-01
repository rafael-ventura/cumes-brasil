import { QueryToken } from "./QueryToken";
export declare class CloseSubclauseToken extends QueryToken {
    boostParameterName: string;
    private constructor();
    static create(): CloseSubclauseToken;
    writeTo(writer: any): void;
}
