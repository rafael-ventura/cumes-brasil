import { FacetBase } from "./FacetBase";
import { RangeBuilder } from "./RangeBuilder";
import { FacetToken } from "../../Session/Tokens/FacetToken";
export declare class GenericRangeFacet extends FacetBase {
    private readonly _parent;
    ranges: RangeBuilder<any>[];
    constructor(parent?: FacetBase);
    static parse(rangeBuilder: RangeBuilder<any>, addQueryParameter: (o: any) => string): string;
    toFacetToken(addQueryParameter: (o: any) => string): FacetToken;
}
