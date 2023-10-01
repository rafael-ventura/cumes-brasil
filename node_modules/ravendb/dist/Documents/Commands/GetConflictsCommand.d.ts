import { HttpRequestParameters } from "../../Primitives/Http";
import { RavenCommand } from "../../Http/RavenCommand";
import { GetConflictsResult } from "./GetConflictsResult";
import { ServerNode } from "../../Http/ServerNode";
import * as stream from "readable-stream";
import { DocumentConventions } from "../Conventions/DocumentConventions";
export declare class GetConflictsCommand extends RavenCommand<GetConflictsResult> {
    private readonly _id;
    private readonly _conventions;
    constructor(id: string, conventions: DocumentConventions);
    get isReadRequest(): boolean;
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
