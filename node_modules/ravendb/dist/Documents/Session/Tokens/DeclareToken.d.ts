import { QueryToken } from "./QueryToken";
export declare class DeclareToken extends QueryToken {
    private _name;
    private _parameters;
    private _body;
    private _timeSeries;
    private constructor();
    static createFunction(name: string, body: string): DeclareToken;
    static createFunction(name: string, body: string, parameters: string): DeclareToken;
    static createTimeSeries(name: string, body: string): DeclareToken;
    static createTimeSeries(name: string, body: string, parameters: string): DeclareToken;
    writeTo(writer: any): void;
}
