import * as stream from "readable-stream";
export interface CollectResultStreamOptions<TResult> {
    reduceResults: (result: TResult, next: object, index?: number) => TResult;
    initResult?: TResult;
}
export declare function lastValue(_: object, chunk: object): any;
export declare function lastChunk(_: object, chunk: object): object;
export declare class CollectResultStream<TResult = object> extends stream.Writable {
    private _resultIndex;
    private _result;
    private readonly _reduceResults;
    private _resultPromise;
    private _resolver;
    get promise(): Promise<TResult>;
    constructor(opts: CollectResultStreamOptions<TResult>);
    static collectArray<TItem>(handleEmitPath?: boolean): CollectResultStreamOptions<TItem[]>;
    _write(chunk: any, enc: any, callback: any): void;
}
