import { IndexQueryWithParameters } from "./IndexQueryWithParameters";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { TypesAwareObjectMapper } from "../../Mapping/ObjectMapper";
export interface IndexQueryParameters {
    [key: string]: object;
}
export declare class IndexQuery extends IndexQueryWithParameters<IndexQueryParameters> {
    constructor();
    constructor(query?: string);
    disableCaching: boolean;
    getQueryHash(mapper: TypesAwareObjectMapper): string;
}
export declare function writeIndexQuery(conventions: DocumentConventions, indexQuery: IndexQuery): string;
