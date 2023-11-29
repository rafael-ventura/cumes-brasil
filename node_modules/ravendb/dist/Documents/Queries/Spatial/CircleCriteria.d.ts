import { SpatialCriteria } from "./SpatialCriteria";
import { SpatialUnits, SpatialRelation } from "../../Indexes/Spatial";
import { ShapeToken } from "../../Session/Tokens/ShapeToken";
export declare class CircleCriteria extends SpatialCriteria {
    private readonly _radius;
    private readonly _latitude;
    private readonly _longitude;
    private readonly _radiusUnits;
    constructor(radius: number, latitude: number, longitude: number, radiusUnits: SpatialUnits, relation: SpatialRelation, distErrorPercent: number);
    protected _getShapeToken(addQueryParameter: (val: any) => string): ShapeToken;
}
