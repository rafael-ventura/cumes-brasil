export declare class Lazy<T> {
    private readonly _valueFactory;
    private _value;
    constructor(valueFactory: () => Promise<T>);
    isValueCreated(): boolean;
    getValue(): Promise<T>;
}
