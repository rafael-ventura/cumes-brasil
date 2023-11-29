import { RavenCommand } from "../../../Http/RavenCommand";
import { BatchCommandResult } from "../../Session/Operations/BatchCommandResult";
import { IDisposable } from "../../../Types/Contracts";
import { DocumentConventions } from "../../Conventions/DocumentConventions";
import { ICommandData } from "../CommandData";
import { BatchOptions } from "./BatchOptions";
import { TransactionMode } from "../../Session/TransactionMode";
import { HttpRequestParameters } from "../../../Primitives/Http";
import { ServerNode } from "../../../Http/ServerNode";
import * as stream from "readable-stream";
export declare class SingleNodeBatchCommand extends RavenCommand<BatchCommandResult> implements IDisposable {
    private _supportsAtomicWrites;
    private readonly _attachmentStreams;
    private readonly _conventions;
    private readonly _commands;
    private readonly _options;
    private readonly _mode;
    constructor(conventions: DocumentConventions, commands: ICommandData[]);
    constructor(conventions: DocumentConventions, commands: ICommandData[], options: BatchOptions);
    constructor(conventions: DocumentConventions, commands: ICommandData[], options: BatchOptions, transactionMode: TransactionMode);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
    protected _appendOptions(): string;
    get isReadRequest(): boolean;
    dispose(): void;
}
