import { IIndexQuery } from "./IIndexQuery";
import { ProjectionBehavior } from "./ProjectionBehavior";
export declare class IndexQueryBase<T> implements IIndexQuery {
    pageSize: number;
    query: string;
    queryParameters: T;
    projectionBehavior: ProjectionBehavior;
    start: number;
    waitForNonStaleResults: boolean;
    waitForNonStaleResultsTimeout: number;
    get pageSizeSet(): boolean;
}
