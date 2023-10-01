import { Facet } from "./Facet";
import { RangeFacet } from "./RangeFacet";
import { SetupDocumentBase } from "../../SetupDocumentBase";
export declare class FacetSetup extends SetupDocumentBase {
    id: string;
    facets: Facet[];
    rangeFacets: RangeFacet[];
    toRemoteFieldNames(): object;
}
