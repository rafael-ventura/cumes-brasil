import { RangeBuilder } from "./RangeBuilder";
import { IFacetOperations } from "./IFacetOperations";
import { Field } from "../../../Types";
export interface IFacetBuilder<T> {
    byRanges(range: RangeBuilder<any>, ...ranges: RangeBuilder<any>[]): IFacetOperations<T>;
    byField(fieldName: Field<T>): IFacetOperations<T>;
    allResults(): IFacetOperations<T>;
}
