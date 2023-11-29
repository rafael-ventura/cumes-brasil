import { FacetBase } from "./FacetBase";
import { FacetToken } from "../../Session/Tokens/FacetToken";
export declare class RangeFacet extends FacetBase {
    private readonly _parent;
    ranges: string[];
    constructor(parent?: FacetBase);
    toFacetToken(addQueryParameter: (o: any) => string): FacetToken;
}
