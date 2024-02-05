import { QueryToken } from "./QueryToken";
import { Facet } from "../../Queries/Facets/Facet";
import { FacetBase } from "../../Queries/Facets/FacetBase";
import { GenericRangeFacet } from "../../Queries/Facets/GenericRangeFacet";
import { RangeFacet } from "../../Queries/Facets/RangeFacet";
import { StringBuilder } from "../../../Utility/StringBuilder";
export interface FacetTokenSetupDocumentIdOptions {
    facetSetupDocumentId: string;
}
export interface FacetTokenAggregateByFieldNameOptions {
    aggregateByFieldName?: string;
    alias: string;
    ranges?: string[];
    optionsParameterName: string;
}
export declare class FacetToken extends QueryToken {
    private readonly _facetSetupDocumentId;
    private readonly _aggregateByFieldName;
    private readonly _alias;
    private readonly _ranges;
    private readonly _optionsParameterName;
    private readonly _aggregations;
    getName(): string;
    private constructor();
    private constructor();
    static create(facetSetupDocumentId: string): FacetToken;
    static create(facet: GenericRangeFacet, addQueryParameter: (o: any) => string): FacetToken;
    static create(facet: RangeFacet, addQueryParameter: (o: any) => string): FacetToken;
    static create(facet: Facet, addQueryParameter: (o: any) => string): FacetToken;
    static create(facet: FacetBase, addQueryParameter: (o: any) => string): FacetToken;
    writeTo(writer: StringBuilder): void;
    private static _applyAggregations;
    private static _getOptionsParameterName;
}
export declare class FacetAggregationToken extends QueryToken {
    private _fieldName;
    private _fieldDisplayName;
    private readonly _aggregation;
    private constructor();
    writeTo(writer: StringBuilder): void;
    static max(fieldName: string): FacetAggregationToken;
    static max(fieldName: string, fieldDisplayName: string): FacetAggregationToken;
    static min(fieldName: string): FacetAggregationToken;
    static min(fieldName: string, fieldDisplayName: string): FacetAggregationToken;
    static average(fieldName: string): FacetAggregationToken;
    static average(fieldName: string, fieldDisplayName: string): FacetAggregationToken;
    static sum(fieldName: string): FacetAggregationToken;
    static sum(fieldName: string, fieldDisplayName: string): FacetAggregationToken;
}
