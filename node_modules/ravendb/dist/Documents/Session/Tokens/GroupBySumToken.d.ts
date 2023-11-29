import { QueryToken } from "./QueryToken";
export declare class GroupBySumToken extends QueryToken {
    private readonly _projectedName;
    private _fieldName;
    private constructor();
    static create(fieldName: string, projectedName: string): GroupBySumToken;
    writeTo(writer: any): void;
}
