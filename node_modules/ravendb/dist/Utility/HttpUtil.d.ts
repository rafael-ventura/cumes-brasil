/// <reference types="node" />
import { Response as HttpResponse } from "node-fetch";
import { IncomingHttpHeaders } from "http";
export declare function getRequiredEtagHeader(response: HttpResponse): string;
export declare function getEtagHeader(responseOrHeaders: HttpResponse | IncomingHttpHeaders | object): string;
export declare function etagHeaderToChangeVector(responseHeader: string): string;
export declare function getBooleanHeader(response: HttpResponse, header: string): boolean;
export declare function getHeaders(): HeadersBuilder;
export declare function closeHttpResponse(response: HttpResponse): void;
export declare class HeadersBuilder {
    private _result;
    static create(): HeadersBuilder;
    typeAppJson(): this;
    with(name: string, val: string): this;
    build(): {
        [key: string]: string;
    };
}
