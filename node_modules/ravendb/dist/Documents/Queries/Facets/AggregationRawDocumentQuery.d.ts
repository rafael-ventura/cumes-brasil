import { AggregationQueryBase } from "./AggregationQueryBase";
import { IRawDocumentQuery } from "../../Session/IRawDocumentQuery";
import { InMemoryDocumentSessionOperations } from "../../Session/InMemoryDocumentSessionOperations";
import { IndexQuery } from "../IndexQuery";
import { QueryResult } from "../QueryResult";
export declare class AggregationRawDocumentQuery<T extends object> extends AggregationQueryBase {
    private readonly _source;
    constructor(source: IRawDocumentQuery<T>, session: InMemoryDocumentSessionOperations);
    protected _getIndexQuery(updateAfterQueryExecuted?: boolean): IndexQuery;
    emit(eventName: "afterQueryExecuted", queryResult: QueryResult): void;
}
