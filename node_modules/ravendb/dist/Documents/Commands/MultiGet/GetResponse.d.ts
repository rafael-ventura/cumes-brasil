export declare class GetResponse {
    constructor();
    private _elapsed;
    private _result;
    private _headers;
    private _statusCode;
    private _forceRetry;
    static create(data: object): GetResponse & object;
    get elapsed(): number;
    set elapsed(elapsed: number);
    get result(): string;
    set result(result: string);
    get headers(): {
        [key: string]: string;
    };
    set headers(headers: {
        [key: string]: string;
    });
    get statusCode(): number;
    set statusCode(statusCode: number);
    get forceRetry(): boolean;
    set forceRetry(forceRetry: boolean);
    requestHasErrors(): boolean;
}
