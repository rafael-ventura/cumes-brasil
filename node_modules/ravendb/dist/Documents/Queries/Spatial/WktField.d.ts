import { DynamicSpatialField } from "./DynamicSpatialField";
export declare class WktField extends DynamicSpatialField {
    wkt: string;
    constructor(wkt: string);
    toField(ensureValidFieldName: (fieldName: string, isNestedPath: boolean) => string): string;
}
