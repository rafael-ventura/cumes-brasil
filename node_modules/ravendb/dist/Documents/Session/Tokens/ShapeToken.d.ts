import { QueryToken } from "./QueryToken";
import { SpatialUnits } from "../../Indexes/Spatial";
export declare class ShapeToken extends QueryToken {
    private readonly _shape;
    private constructor();
    static circle(radiusParameterName: string, latitudeParameterName: string, longitudeParameterName: string, radiusUnits: SpatialUnits): ShapeToken;
    static wkt(shapeWktParameterName: string, units: SpatialUnits): ShapeToken;
    writeTo(writer: any): void;
}
