/// <reference types="node" />
import * as stream from "readable-stream";
import { RavenCommand } from "../Http/RavenCommand";
import { HttpRequestParameters } from "../Primitives/Http";
import { IMetadataDictionary } from "./Session/IMetadataDictionary";
import { IDocumentStore } from "./IDocumentStore";
import { ServerNode } from "../Http/ServerNode";
import { IDisposable } from "../Types/Contracts";
import { TypedTimeSeriesEntry } from "./Session/TimeSeries/TypedTimeSeriesEntry";
import { EntityConstructor } from "../Types";
export declare class BulkInsertOperation {
    private _options;
    private readonly _generateEntityIdOnTheClient;
    private readonly _requestExecutor;
    private _bulkInsertExecuteTask;
    private _completedWithError;
    private _first;
    private _inProgressCommand;
    private readonly _countersOperation;
    private readonly _attachmentsOperation;
    private _operationId;
    private _nodeTag;
    private _useCompression;
    private readonly _timeSeriesBatchSize;
    private _concurrentCheck;
    private _isInitialWrite;
    private _bulkInsertAborted;
    private _abortReject;
    private _aborted;
    private _currentWriter;
    private _requestBodyStream;
    private _pipelineFinished;
    constructor(database: string, store: IDocumentStore, options?: BulkInsertOptions);
    get useCompression(): boolean;
    set useCompression(value: boolean);
    private _throwBulkInsertAborted;
    private _throwNoDatabase;
    private _waitForId;
    private static _typeCheckStoreArgs;
    store(entity: object): any;
    store(entity: object, id: string): any;
    store(entity: object, metadata: IMetadataDictionary): any;
    store(entity: object, id: string, metadata: IMetadataDictionary): any;
    private _handleErrors;
    private _concurrencyCheck;
    private _endPreviousCommandIfNeeded;
    private _writeString;
    private _writeComma;
    private _executeBeforeStore;
    private _checkIfBulkInsertWasAborted;
    private static _verifyValidId;
    private _getExceptionFromOperation;
    private _ensureStream;
    abort(): Promise<void>;
    finish(): Promise<void>;
    private readonly _conventions;
    private _getId;
    attachmentsFor(id: string): IAttachmentsBulkInsert;
    timeSeriesFor(id: string, name: any): ITimeSeriesBulkInsert;
    timeSeriesFor<T extends object>(clazz: EntityConstructor<T>, id: string): ITypedTimeSeriesBulkInsert<T>;
    timeSeriesFor<T extends object>(clazz: EntityConstructor<T>, id: string, name: string): ITypedTimeSeriesBulkInsert<T>;
    private _typedTimeSeriesFor;
    countersFor(id: string): ICountersBulkInsert;
    private _timeSeriesFor;
    static throwAlreadyRunningTimeSeries(): void;
    private static readonly _countersBulkInsertClass;
    private static _countersBulkInsertOperationClass;
    private static _timeSeriesBulkInsertBaseClass;
    private static _timeSeriesBulkInsertClass;
    private static _typedTimeSeriesBulkInsertClass;
    private static _attachmentsBulkInsertClass;
    private static _attachmentsBulkInsertOperationClass;
}
export interface ICountersBulkInsert {
    increment(name: string): Promise<void>;
    increment(name: string, delta: number): Promise<void>;
}
export interface ITimeSeriesBulkInsert extends IDisposable {
    append(timestamp: Date, value: number): Promise<void>;
    append(timestamp: Date, value: number, tag: string): Promise<void>;
    append(timestamp: Date, values: number[]): Promise<void>;
    append(timestamp: Date, values: number[], tag: string): Promise<void>;
}
export interface ITypedTimeSeriesBulkInsert<T extends object> extends IDisposable {
    append(timestamp: Date, value: T): Promise<void>;
    append(timestamp: Date, value: T, tag: string): Promise<void>;
    append(entry: TypedTimeSeriesEntry<T>): Promise<void>;
}
export interface IAttachmentsBulkInsert {
    store(name: string, bytes: Buffer): Promise<void>;
    store(name: string, bytes: Buffer, contentType: string): Promise<void>;
}
export declare class BulkInsertCommand extends RavenCommand<void> {
    get isReadRequest(): boolean;
    private readonly _stream;
    private _skipOverwriteIfUnchanged;
    private readonly _id;
    useCompression: boolean;
    constructor(id: number, stream: stream.Readable, nodeTag: string, skipOverwriteIfUnchanged: boolean);
    createRequest(node: ServerNode): HttpRequestParameters;
    setResponseAsync(bodyStream: stream.Stream, fromCache: boolean): Promise<string>;
}
export interface BulkInsertOptions {
    useCompression?: boolean;
    skipOverwriteIfUnchanged?: boolean;
}
