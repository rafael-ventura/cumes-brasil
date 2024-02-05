export declare class JavaScriptMap<TKey, TValue> {
    private readonly _suffix;
    private _argCounter;
    private readonly _pathToMap;
    private readonly _scriptLines;
    private readonly _parameters;
    constructor(suffix: number, pathToMap: string);
    set(key: TKey, value: TValue): this;
    remove(key: TKey): this;
    private _getNextArgumentName;
    getScript(): string;
    get parameters(): Record<string, any>;
}
