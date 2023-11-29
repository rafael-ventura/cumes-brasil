import { QueryToken } from "./QueryToken";
export declare class GroupByKeyToken extends QueryToken {
    private readonly _fieldName;
    private readonly _projectedName;
    private constructor();
    static create(fieldName: string, projectedName: string): GroupByKeyToken;
    writeTo(writer: any): void;
}
