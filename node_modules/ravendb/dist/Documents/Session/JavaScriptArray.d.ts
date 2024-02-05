export declare class JavaScriptArray<U> {
    private readonly _suffix;
    private _argCounter;
    private readonly _pathToArray;
    private _scriptLines;
    private _parameters;
    constructor(suffix: number, pathToArray: string);
    push(...u: U[]): this;
    removeAt(index: number): this;
    private _getNextArgumentName;
    get script(): string;
    get parameters(): {};
}
