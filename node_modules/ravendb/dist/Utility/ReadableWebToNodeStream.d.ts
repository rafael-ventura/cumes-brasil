import { Readable } from 'readable-stream';
export declare class ReadableWebToNodeStream extends Readable {
    bytesRead: number;
    released: boolean;
    private reader;
    private pendingRead;
    constructor(stream: any);
    _read(): Promise<void>;
    waitForReadToComplete(): Promise<void>;
    close(): Promise<void>;
    private syncAndRelease;
}
