import { IMoreLikeThisOperations } from "./IMoreLikeThisOperations";
import { IMoreLikeThisBuilderForDocumentQuery } from "./IMoreLikeThisBuilderForDocumentQuery";
import { IMoreLikeThisBuilderBase } from "./IMoreLikeThisBuilderBase";
import { MoreLikeThisBase } from "./MoreLikeThisBase";
import { MoreLikeThisOptions } from "./MoreLikeThisOptions";
import { IFilterDocumentQueryBase } from "../../Session/IFilterDocumentQueryBase";
import { IDocumentQuery } from "../../Session/IDocumentQuery";
export declare class MoreLikeThisBuilder<T extends object> implements IMoreLikeThisOperations<T>, IMoreLikeThisBuilderForDocumentQuery<T>, IMoreLikeThisBuilderBase<T> {
    private _moreLikeThis;
    getMoreLikeThis(): MoreLikeThisBase;
    usingAnyDocument(): IMoreLikeThisOperations<T>;
    usingDocument(documentJson: string): IMoreLikeThisOperations<T>;
    usingDocument(builder: (query: IFilterDocumentQueryBase<T, IDocumentQuery<T>>) => IDocumentQuery<T>): IMoreLikeThisOperations<T>;
    withOptions(options: MoreLikeThisOptions): IMoreLikeThisOperations<T>;
}
