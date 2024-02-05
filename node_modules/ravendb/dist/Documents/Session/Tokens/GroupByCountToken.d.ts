import { QueryToken } from "./QueryToken";
export declare class GroupByCountToken extends QueryToken {
    private readonly _fieldName;
    private constructor();
    static create(fieldName: string): GroupByCountToken;
    writeTo(writer: any): void;
}
