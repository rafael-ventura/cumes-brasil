import { ShapeToken } from "../../Session/Tokens/ShapeToken";
import { SpatialRelation } from "../../Indexes/Spatial";
import { QueryToken } from "../../Session/Tokens/QueryToken";
export declare abstract class SpatialCriteria {
    private readonly _relation;
    private readonly _distanceErrorPct;
    protected constructor(relation: SpatialRelation, distanceErrorPct: number);
    protected abstract _getShapeToken(addQueryParameter: (o: object) => string): ShapeToken;
    toQueryToken(fieldName: string, addQueryParameter: (o: object) => string): QueryToken;
}
