import { IGroupByDocumentQuery } from "./IGroupByDocumentQuery";
import { DocumentQuery } from "./DocumentQuery";
import { GroupByField } from "./GroupByField";
import { IDocumentQuery } from "./IDocumentQuery";
export declare class GroupByDocumentQuery<T extends object> implements IGroupByDocumentQuery<T> {
    private readonly _query;
    constructor(query: DocumentQuery<T>);
    selectKey(): IGroupByDocumentQuery<T>;
    selectKey(fieldName: string): IGroupByDocumentQuery<T>;
    selectKey(fieldName: string, projectedName: string): IGroupByDocumentQuery<T>;
    selectSum(field: GroupByField, ...fields: GroupByField[]): IDocumentQuery<T>;
    selectCount(): IDocumentQuery<T>;
    selectCount(projectedName: string): IDocumentQuery<T>;
}
