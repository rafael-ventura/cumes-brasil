import { AggregationQueryBase } from "./AggregationQueryBase";
import { FacetBase } from "./FacetBase";
import { IAggregationDocumentQuery } from "./IAggregationDocumentQuery";
import { DocumentQuery } from "../../Session/DocumentQuery";
import { IFacetBuilder } from "./IFacetBuilder";
import { IndexQuery } from "../IndexQuery";
import { QueryResult } from "../QueryResult";
export declare class AggregationDocumentQuery<T extends object> extends AggregationQueryBase implements IAggregationDocumentQuery<T> {
    private _source;
    constructor(source: DocumentQuery<T>);
    andAggregateBy(facet: FacetBase): IAggregationDocumentQuery<T>;
    andAggregateBy(builder: (facetBuilder: IFacetBuilder<T>) => void): IAggregationDocumentQuery<T>;
    protected _getIndexQuery(updateAfterQueryExecuted?: boolean): IndexQuery;
    emit(eventName: "afterQueryExecuted", queryResult: QueryResult): void;
}
