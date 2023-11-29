import { IFacetBuilder } from "./IFacetBuilder";
import { IFacetOperations } from "./IFacetOperations";
import { RangeBuilder } from "./RangeBuilder";
import { FacetOptions } from ".";
import { FacetBase } from "./FacetBase";
import { Field } from "../../../Types";
export declare class FacetBuilder<T> implements IFacetBuilder<T>, IFacetOperations<T> {
    private _range;
    private _default;
    private static _rqlKeywords;
    byRanges(range: RangeBuilder, ...ranges: RangeBuilder[]): IFacetOperations<T>;
    byField(fieldName: Field<T>): IFacetOperations<T>;
    allResults(): IFacetOperations<T>;
    withOptions(options: FacetOptions): IFacetOperations<T>;
    withDisplayName(displayName: string): IFacetOperations<T>;
    sumOn(path: string): IFacetOperations<T>;
    sumOn(path: string, displayName: string): IFacetOperations<T>;
    minOn(path: string): IFacetOperations<T>;
    minOn(path: string, displayName: string): IFacetOperations<T>;
    maxOn(path: string): IFacetOperations<T>;
    maxOn(path: string, displayName: string): IFacetOperations<T>;
    averageOn(path: string): IFacetOperations<T>;
    averageOn(path: string, displayName: string): IFacetOperations<T>;
    getFacet(): FacetBase;
}
