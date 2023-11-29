import { SpatialCriteria } from "./SpatialCriteria";
import { SpatialRelation, SpatialUnits } from "../../Indexes/Spatial";
import { ShapeToken } from "../../Session/Tokens/ShapeToken";
export declare class WktCriteria extends SpatialCriteria {
    private readonly _shapeWkt;
    private readonly _radiusUnits;
    constructor(shapeWkt: string, relation: SpatialRelation, radiusUnits: SpatialUnits, distanceErrorPct: number);
    protected _getShapeToken(addQueryParameter: (o: any) => string): ShapeToken;
}
