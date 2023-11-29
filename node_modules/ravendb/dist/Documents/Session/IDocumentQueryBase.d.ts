import { IQueryBase } from "./IQueryBase";
import { IFilterDocumentQueryBase } from "./IFilterDocumentQueryBase";
import { OrderingType } from "./OrderingType";
import { DynamicSpatialField } from "../Queries/Spatial/DynamicSpatialField";
import { ValueCallback } from "../../Types/Callbacks";
import { Explanations } from "../Queries/Explanation/Explanations";
import { ExplanationOptions } from "../Queries/Explanation/ExplanationOptions";
import { Highlightings } from "../Queries/Highlighting/Hightlightings";
import { HighlightingParameters } from "../Queries/Highlighting/HighlightingParameters";
import { IQueryIncludeBuilder } from "../Session/Loaders/IQueryIncludeBuilder";
import { Field } from "../../Types";
export interface IDocumentQueryBase<T extends object, TSelf extends IDocumentQueryBase<T, TSelf>> extends IQueryBase<T, TSelf>, IFilterDocumentQueryBase<T, TSelf> {
    addOrder(fieldName: Field<T>, descending: boolean): TSelf;
    addOrder(fieldName: Field<T>, descending: boolean, ordering: OrderingType): TSelf;
    boost(boost: number): TSelf;
    distinct(): TSelf;
    includeExplanations(explanations: ValueCallback<Explanations>): TSelf;
    includeExplanations(options: ExplanationOptions, explanations: ValueCallback<Explanations>): TSelf;
    fuzzy(fuzzy: number): TSelf;
    highlight(parameters: HighlightingParameters, hightlightingsCallback: ValueCallback<Highlightings>): TSelf;
    include(path: string): TSelf;
    include(includes: (includeBuilder: IQueryIncludeBuilder) => void): TSelf;
    intersect(): TSelf;
    orderBy(field: string): TSelf;
    orderBy(field: string, ordering: OrderingType): TSelf;
    orderBy(field: string, options: {
        sorterName: string;
    }): TSelf;
    orderByDescending(field: string): TSelf;
    orderByDescending(field: string, ordering: OrderingType): TSelf;
    orderByDescending(field: string, options: {
        sorterName: string;
    }): TSelf;
    orderByScore(): TSelf;
    orderByScoreDescending(): TSelf;
    proximity(proximity: number): TSelf;
    randomOrdering(): TSelf;
    randomOrdering(seed: string): TSelf;
    orderByDistance(field: DynamicSpatialField, latitude: number, longitude: number): TSelf;
    orderByDistance(field: DynamicSpatialField, shapeWkt: string): TSelf;
    orderByDistance(fieldName: Field<T>, latitude: number, longitude: number): TSelf;
    orderByDistance(fieldName: Field<T>, latitude: number, longitude: number, roundFactor: number): TSelf;
    orderByDistance(fieldName: Field<T>, shapeWkt: string): TSelf;
    orderByDistanceDescending(field: DynamicSpatialField, latitude: number, longitude: number): TSelf;
    orderByDistanceDescending(field: DynamicSpatialField, shapeWkt: string): TSelf;
    orderByDistanceDescending(fieldName: Field<T>, latitude: number, longitude: number): TSelf;
    orderByDistanceDescending(fieldName: Field<T>, latitude: number, longitude: number, roundFactor: number): TSelf;
    orderByDistanceDescending(fieldName: Field<T>, shapeWkt: string): TSelf;
}
