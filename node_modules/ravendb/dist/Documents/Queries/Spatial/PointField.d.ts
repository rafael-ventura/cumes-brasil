import { DynamicSpatialField } from "./DynamicSpatialField";
export declare class PointField extends DynamicSpatialField {
    latitude: string;
    longitude: string;
    constructor(latitude: string, longitude: string);
    toField(ensureValidFieldName: (fieldName: string, isNestedPath: boolean) => string): string;
}
