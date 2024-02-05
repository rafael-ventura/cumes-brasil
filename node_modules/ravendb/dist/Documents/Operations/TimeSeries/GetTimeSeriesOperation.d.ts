import { IOperation, OperationResultType } from "../OperationAbstractions";
import { TimeSeriesRangeResult } from "./TimeSeriesRangeResult";
import { IDocumentStore } from "../../IDocumentStore";
import { HttpCache } from "../../../Http/HttpCache";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
import { StringBuilder } from "../../../Utility/StringBuilder";
import { ServerResponse } from "../../../Types";
import { ITimeSeriesIncludeBuilder } from "../../Session/Loaders/ITimeSeriesIncludeBuilder";
export declare class GetTimeSeriesOperation implements IOperation<TimeSeriesRangeResult> {
    private readonly _docId;
    private readonly _name;
    private readonly _start;
    private readonly _pageSize;
    private readonly _from;
    private readonly _to;
    private readonly _includes;
    constructor(docId: string, timeseries: string);
    constructor(docId: string, timeseries: string, from: Date, to: Date);
    constructor(docId: string, timeseries: string, from: Date, to: Date, start: number);
    constructor(docId: string, timeseries: string, from: Date, to: Date, start: number, pageSize: number);
    constructor(docId: string, timeseries: string, from: Date, to: Date, start: number, pageSize: number, includes: (includeBuilder: ITimeSeriesIncludeBuilder) => void);
    get resultType(): OperationResultType;
    getCommand(store: IDocumentStore, conventions: DocumentConventions, httpCache: HttpCache): RavenCommand<TimeSeriesRangeResult>;
}
export declare class GetTimeSeriesCommand extends RavenCommand<TimeSeriesRangeResult> {
    private readonly _conventions;
    private readonly _docId;
    private readonly _name;
    private readonly _start;
    private readonly _pageSize;
    private readonly _from;
    private readonly _to;
    private readonly _includes;
    constructor(conventions: DocumentConventions, docId: string, name: string, from: Date, to: Date, start: number, pageSize: number, includes?: (includeBuilder: ITimeSeriesIncludeBuilder) => void);
    createRequest(node: ServerNode): HttpRequestParameters;
    static addIncludesToRequest(pathBuilder: StringBuilder, includes: (includeBuilder: ITimeSeriesIncludeBuilder) => void): void;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
    static mapToLocalObject(json: any, conventions: DocumentConventions): ServerResponse<TimeSeriesRangeResult>;
}
export declare function reviveTimeSeriesRangeResult(json: ServerResponse<TimeSeriesRangeResult>, conventions: DocumentConventions): TimeSeriesRangeResult;
