export declare class RangeBuilder<T = any> {
    private readonly _path;
    private _lessBound;
    private _greaterBound;
    private _lessInclusive;
    private _greaterInclusive;
    private _lessSet;
    private _greaterSet;
    constructor(path: string);
    static forPath<T>(path: string): RangeBuilder<T>;
    private _createClone;
    isLessThan(value: T): RangeBuilder<T>;
    isLessThanOrEqualTo(value: T): RangeBuilder<T>;
    isGreaterThan(value: T): RangeBuilder<T>;
    isGreaterThanOrEqualTo(value: T): RangeBuilder<T>;
    getStringRepresentation(addQueryParameter: (o: any) => string): string;
}
