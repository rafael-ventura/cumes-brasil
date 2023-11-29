import { SpatialCriteria } from "./SpatialCriteria";
import { SpatialRelation, SpatialUnits } from "../../Indexes/Spatial";
export declare class SpatialCriteriaFactory {
    static INSTANCE: SpatialCriteriaFactory;
    private constructor();
    relatesToShape(shapeWkt: string, relation: SpatialRelation): SpatialCriteria;
    relatesToShape(shapeWkt: string, relation: SpatialRelation, units: SpatialUnits, distErrorPercent: number): SpatialCriteria;
    private static _normalizeArgs;
    intersects(shapeWkt: string): SpatialCriteria;
    intersects(shapeWkt: string, distErrorPercent: number): SpatialCriteria;
    intersects(shapeWkt: string, distErrorPercent: number): SpatialCriteria;
    intersects(shapeWkt: string, units: SpatialUnits, distErrorPercent: number): SpatialCriteria;
    contains(shapeWkt: string): SpatialCriteria;
    contains(shapeWkt: string, units: SpatialUnits): SpatialCriteria;
    contains(shapeWkt: string, distErrorPercent: number): SpatialCriteria;
    contains(shapeWkt: string, units: SpatialUnits, distErrorPercent: number): SpatialCriteria;
    disjoint(shapeWkt: string): SpatialCriteria;
    disjoint(shapeWkt: string, units: SpatialUnits): SpatialCriteria;
    disjoint(shapeWkt: string, distErrorPercent: number): SpatialCriteria;
    disjoint(shapeWkt: string, units: SpatialUnits, distErrorPercent: number): SpatialCriteria;
    within(shapeWkt: string): SpatialCriteria;
    within(shapeWkt: string, units: SpatialUnits): SpatialCriteria;
    within(shapeWkt: string, distErrorPercent: number): SpatialCriteria;
    within(shapeWkt: string, units: SpatialUnits, distErrorPercent: number): SpatialCriteria;
    withinRadius(radius: number, latitude: number, longitude: number): SpatialCriteria;
    withinRadius(radius: number, latitude: number, longitude: number, radiusUnits: SpatialUnits): SpatialCriteria;
    withinRadius(radius: number, latitude: number, longitude: number, radiusUnits: SpatialUnits, distErrorPercent: number): SpatialCriteria;
}
