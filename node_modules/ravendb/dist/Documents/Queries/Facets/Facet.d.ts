import { FacetBase } from "./FacetBase";
import { FacetToken } from "../../Session/Tokens/FacetToken";
export declare class Facet extends FacetBase {
    fieldName: string;
    toFacetToken(addQueryParameter: (o: any) => string): FacetToken;
}
