export declare class GetRequest {
    private _url;
    private _headers;
    private _query;
    private _method;
    private _canCacheAggressively;
    get urlAndQuery(): string;
    private _content;
    constructor();
    get url(): string;
    set url(url: string);
    get headers(): {
        [key: string]: string | string[];
    };
    set headers(headers: {
        [key: string]: string | string[];
    });
    get query(): string;
    set query(query: string);
    get method(): string;
    set method(method: string);
    get body(): string;
    set body(content: string);
    get canCacheAggressively(): boolean;
    set canCacheAggressively(value: boolean);
}
