/// <reference types="node" />
import * as stream from "readable-stream";
export declare const finishedAsync: (src: any) => Promise<any>;
export declare const pipelineAsync: (...src: stream.Stream[]) => Promise<any>;
export declare function reduceStreamToPromise<T>(readable: stream.Readable, dataCallback?: (result: T, chunk: any) => T, seed?: T): Promise<T>;
export declare function readToBuffer(stream: stream.Stream): Promise<Buffer>;
export declare function readToEnd(readable: stream.Readable | stream.Stream): Promise<string>;
export declare function bufferToReadable(b: Buffer): stream.Readable;
export declare function stringToReadable(s: string): stream.Readable;
export declare function printStreamTraffic(str: any): void;
