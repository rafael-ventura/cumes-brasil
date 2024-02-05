export declare abstract class DynamicSpatialField {
    roundFactor: number;
    abstract toField(ensureValidFieldName: (fieldName: string, isNestedPath: boolean) => string): string;
    roundTo(factor: number): this;
}
