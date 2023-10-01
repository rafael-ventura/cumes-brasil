import { FacetOptions, FacetAggregation } from ".";
import { FacetToken } from "../../Session/Tokens/FacetToken";
import { FacetAggregationField } from "./FacetAggregationField";
export declare abstract class FacetBase {
    displayFieldName: string;
    options: FacetOptions;
    aggregations: Map<FacetAggregation, Set<FacetAggregationField>>;
    abstract toFacetToken(addQueryParameter: (o: any) => string): FacetToken;
}
