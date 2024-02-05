import { QueryToken } from "./QueryToken";
export declare class DistinctToken extends QueryToken {
    private constructor();
    static INSTANCE: DistinctToken;
    writeTo(writer: any): void;
}
