import { QueryToken } from "./QueryToken";
import { GroupByMethod } from "../../Queries/GroupByMethod";
export declare class GroupByToken extends QueryToken {
    private readonly _fieldName;
    private readonly _method;
    private constructor();
    static create(fieldName: string): GroupByToken;
    static create(fieldName: string, method: GroupByMethod): GroupByToken;
    writeTo(writer: any): void;
}
