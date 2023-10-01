import { ServerNode } from "../../../Http/ServerNode";
import { RavenCommand } from "../../../Http/RavenCommand";
import { HttpRequestParameters } from "../../../Primitives/Http";
import * as stream from "readable-stream";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
export interface HiLoResult {
    prefix: string;
    low: number;
    high: number;
    lastSize: number;
    serverTag: string;
    lastRangeAt: Date;
}
export declare class NextHiloCommand extends RavenCommand<HiLoResult> {
    private readonly _tag;
    private readonly _lastBatchSize;
    private readonly _lastRangeAt;
    private readonly _identityPartsSeparator;
    private readonly _lastRangeMax;
    private readonly _conventions;
    constructor(tag: string, lastBatchSize: number, lastRangeAt: Date, identityPartsSeparator: string, lastRangeMax: number, conventions: DocumentConventions);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    get isReadRequest(): boolean;
}
