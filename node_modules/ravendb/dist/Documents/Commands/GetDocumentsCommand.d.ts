import * as stream from "readable-stream";
import { RavenCommand } from "../../Http/RavenCommand";
import { ServerNode } from "../../Http/ServerNode";
import { HttpRequestParameters } from "../../Primitives/Http";
import { DocumentConventions } from "../Conventions/DocumentConventions";
import { IRavenObject } from "../../Types/IRavenObject";
import { AbstractTimeSeriesRange } from "../Operations/TimeSeries/AbstractTimeSeriesRange";
export interface GetDocumentsCommandCounterOptions {
    counterIncludes?: string[];
    includeAllCounters?: boolean;
}
export interface GetDocumentsCommandOptionsBase extends GetDocumentsCommandCounterOptions {
    conventions: DocumentConventions;
}
export interface GetDocumentsByIdCommandOptions extends GetDocumentsCommandOptionsBase {
    id: string;
    includes?: string[];
    metadataOnly?: boolean;
}
export interface GetDocumentsByIdsCommandOptions extends GetDocumentsCommandOptionsBase {
    ids: string[];
    includes?: string[];
    metadataOnly?: boolean;
    timeSeriesIncludes?: AbstractTimeSeriesRange[];
    revisionsIncludesByChangeVector?: string[];
    revisionIncludeByDateTimeBefore?: Date;
    compareExchangeValueIncludes?: string[];
}
export interface GetDocumentsStartingWithOptions extends GetDocumentsCommandOptionsBase {
    start: number;
    pageSize: number;
    startsWith?: string;
    startsAfter?: string;
    matches?: string;
    exclude?: string;
    metadataOnly?: boolean;
}
export interface GetDocumentsResult {
    includes: IRavenObject;
    results: any[];
    counterIncludes: IRavenObject;
    revisionIncludes: any[];
    timeSeriesIncludes: IRavenObject;
    compareExchangeValueIncludes: IRavenObject;
    nextPageStart: number;
}
export declare class GetDocumentsCommand extends RavenCommand<GetDocumentsResult> {
    private readonly _id;
    private readonly _ids;
    private readonly _includes;
    private _counters;
    private _includeAllCounters;
    private _timeSeriesIncludes;
    private _revisionsIncludeByChangeVector;
    private _revisionsIncludeByDateTime;
    private _compareExchangeValueIncludes;
    private readonly _metadataOnly;
    private readonly _startsWith;
    private readonly _matches;
    private readonly _start;
    private readonly _pageSize;
    private readonly _exclude;
    private readonly _startAfter;
    private readonly _conventions;
    constructor(opts: GetDocumentsByIdCommandOptions | GetDocumentsByIdsCommandOptions | GetDocumentsStartingWithOptions);
    createRequest(node: ServerNode): HttpRequestParameters;
    prepareRequestWithMultipleIds(request: HttpRequestParameters, ids: string[]): HttpRequestParameters;
    private static _calculateHash;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    static parseDocumentsResultResponseAsync(bodyStream: stream.Stream, conventions: DocumentConventions, bodyCallback?: (body: string) => void): Promise<GetDocumentsResult>;
    private static _mapToLocalObject;
    get isReadRequest(): boolean;
}
