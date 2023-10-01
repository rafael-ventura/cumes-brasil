import { GroupByMethod } from "./GroupByMethod";
export declare class GroupBy {
    private _field;
    private _method;
    private constructor();
    get field(): string;
    get method(): GroupByMethod;
    static field(fieldName: string): GroupBy;
    static array(fieldName: string): GroupBy;
}
