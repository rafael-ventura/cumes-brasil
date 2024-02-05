import { MoreLikeThisBase } from "./MoreLikeThisBase";
import { IFilterDocumentQueryBase } from "../../Session/IFilterDocumentQueryBase";
import { IDocumentQuery } from "../../Session/IDocumentQuery";
export declare class MoreLikeThisUsingDocumentForDocumentQuery<T extends object> extends MoreLikeThisBase {
    forDocumentQuery: (query: IFilterDocumentQueryBase<T, IDocumentQuery<T>>) => IDocumentQuery<T>;
}
