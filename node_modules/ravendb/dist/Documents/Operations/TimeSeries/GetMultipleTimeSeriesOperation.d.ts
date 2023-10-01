import { IOperation, OperationResultType } from "../OperationAbstractions";
import { TimeSeriesDetails } from "./TimeSeriesDetails";
import { TimeSeriesRange } from "./TimeSeriesRange";
import { IDocumentStore } from "../../IDocumentStore";
import { HttpCache } from "../../../Http/HttpCache";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { RavenCommand } from "../../../Http/RavenCommand";
import { ServerNode } from "../../../Http/ServerNode";
import { ITimeSeriesIncludeBuilder } from "../../Session/Loaders/ITimeSeriesIncludeBuilder";
export declare class GetMultipleTimeSeriesOperation implements IOperation<TimeSeriesDetails> {
    private readonly _docId;
    private _ranges;
    private readonly _start;
    private readonly _pageSize;
    private readonly _includes;
    constructor(docId: string, ranges: TimeSeriesRange[]);
    constructor(docId: string, ranges: TimeSeriesRange[], start: number, pageSize: number);
    constructor(docId: string, ranges: TimeSeriesRange[], start: number, pageSize: number, includes: (includeBuilder: ITimeSeriesIncludeBuilder) => void);
    get resultType(): OperationResultType;
    getCommand(store: IDocumentStore, conventions: DocumentConventions, httpCache: HttpCache): RavenCommand<TimeSeriesDetails>;
}
export declare class GetMultipleTimeSeriesCommand extends RavenCommand<TimeSeriesDetails> {
    private readonly _conventions;
    private readonly _docId;
    private readonly _ranges;
    private readonly _start;
    private readonly _pageSize;
    private readonly _includes;
    constructor(conventions: DocumentConventions, docId: string, ranges: TimeSeriesRange[], start: number, pageSize: number, includes?: (includeBuilder: ITimeSeriesIncludeBuilder) => void);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
